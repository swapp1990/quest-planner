import { API_BASE_URL } from './config';

export const createExtractionJob = async (base64Image, imageType = 'image/jpeg') => {
  const response = await fetch(`${API_BASE_URL}/api/membership_form/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      job_type: 'extract',
      input_params: {
        image_data: base64Image,
        image_type: imageType,
      },
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create extraction job';
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorMessage = Array.isArray(errorJson.detail)
          ? errorJson.detail[0]?.msg || errorMessage
          : errorJson.detail;
      }
    } catch {
      // If not JSON, use status text
      errorMessage = `Server error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const getExtractionJob = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/api/membership_form/jobs/${jobId}`);

  if (!response.ok) {
    let errorMessage = 'Failed to get extraction job';
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorMessage = typeof errorJson.detail === 'string'
          ? errorJson.detail
          : 'Job not found';
      }
    } catch {
      errorMessage = `Server error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const pollExtractionJob = async (jobId, options = {}) => {
  const { maxAttempts = 30, intervalMs = 2000 } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const job = await getExtractionJob(jobId);

    if (job.status === 'completed' || job.status === 'failed') {
      return job;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error('Extraction job timed out');
};
