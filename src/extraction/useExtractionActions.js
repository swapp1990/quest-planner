import { useState, useCallback } from 'react';
import { useExtraction } from './ExtractionContext';
import { useImagePicker } from './useImagePicker';
import { createExtractionJob, pollExtractionJob } from './extractionApi';

export const useExtractionActions = () => {
  const { addExtraction, updateExtraction } = useExtraction();
  const { launchCamera, launchGallery } = useImagePicker();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentExtraction, setCurrentExtraction] = useState(null);
  const [error, setError] = useState(null);

  const processImage = async (imageData, extractionItem) => {
    try {
      console.log('Creating extraction job...');
      // Create job on backend
      const jobResponse = await createExtractionJob(imageData.base64);
      console.log('Job created:', jobResponse);

      const jobId = jobResponse.id || jobResponse.job_id;
      console.log('Job ID:', jobId);

      await updateExtraction(extractionItem.id, {
        status: 'in_progress',
        jobId: jobId,
      });

      // Poll for completion
      console.log('Polling for job completion...');
      const completedJob = await pollExtractionJob(jobId);
      console.log('Job completed:', completedJob);

      if (completedJob.status === 'completed') {
        // Parse output_artifacts - it may contain the result in different formats
        let extractedData = completedJob.output_artifacts || completedJob.result || {};

        // If output_artifacts has a nested structure, extract it
        if (extractedData.raw_response) {
          try {
            // Parse markdown code block if present
            const jsonMatch = extractedData.raw_response.match(/```json\n?([\s\S]*?)\n?```/);
            if (jsonMatch) {
              extractedData = JSON.parse(jsonMatch[1]);
            }
          } catch (e) {
            console.log('Failed to parse raw_response:', e);
          }
        }

        const result = {
          name: extractedData.name || null,
          phone_numbers: extractedData.phone_numbers || [],
          additional_info: extractedData.additional_info || {},
        };

        console.log('Extracted result:', result);

        await updateExtraction(extractionItem.id, {
          status: 'completed',
          result,
        });

        return { success: true, result };
      } else {
        // Extract error message from error object if needed
        let errorMessage = 'Extraction failed';
        if (completedJob.error) {
          errorMessage = typeof completedJob.error === 'string'
            ? completedJob.error
            : completedJob.error.message || 'Extraction failed';
        }

        await updateExtraction(extractionItem.id, {
          status: 'failed',
          error: errorMessage,
        });

        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error('Extraction error:', err.message);
      await updateExtraction(extractionItem.id, {
        status: 'failed',
        error: err.message,
      });

      return { success: false, error: err.message };
    }
  };

  const captureAndExtract = useCallback(
    async (source) => {
      setIsProcessing(true);
      setError(null);
      setCurrentExtraction(null);

      try {
        // Pick image based on source
        console.log('Starting image capture, source:', source);
        const imageData =
          source === 'camera' ? await launchCamera() : await launchGallery();

        console.log('Image data received:', imageData ? 'exists' : 'null', imageData?.uri);

        if (!imageData) {
          // User cancelled
          setIsProcessing(false);
          return { success: false, cancelled: true };
        }

        if (!imageData.base64) {
          throw new Error('Failed to get base64 data from image');
        }

        // Create extraction record
        const extractionItem = await addExtraction({
          imageUri: imageData.uri,
        });

        setCurrentExtraction(extractionItem);

        // Process the image
        const result = await processImage(imageData, extractionItem);

        if (result.success) {
          setCurrentExtraction((prev) => ({
            ...prev,
            status: 'completed',
            result: result.result,
          }));
        } else {
          setCurrentExtraction((prev) => ({
            ...prev,
            status: 'failed',
            error: result.error,
          }));
          setError(result.error);
        }

        return result;
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsProcessing(false);
      }
    },
    [addExtraction, updateExtraction, launchCamera, launchGallery]
  );

  return {
    captureAndExtract,
    isProcessing,
    currentExtraction,
    error,
  };
};
