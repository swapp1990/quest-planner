import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const CircularProgress = ({ size = 140, strokeWidth = 8, progress = 0, maxSegments = 5, color = '#fff' }) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Calculate angles for segments
  const gapAngle = 12; // degrees between segments
  const totalGapAngle = gapAngle * maxSegments;
  const segmentAngle = (360 - totalGapAngle) / maxSegments;

  const completedSegments = Math.floor((progress / 100) * maxSegments);

  // Helper function to convert polar coordinates to cartesian
  // 0 degrees = top (12 o'clock)
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.sin(angleInRadians)),
      y: centerY - (radius * Math.cos(angleInRadians))
    };
  };

  // Helper function to create arc path
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);

    // For counter-clockwise: endAngle < startAngle
    const angleDiff = endAngle - startAngle;
    const largeArcFlag = Math.abs(angleDiff) > 180 ? "1" : "0";
    // sweepFlag = 0 for counter-clockwise, 1 for clockwise
    const sweepFlag = angleDiff < 0 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
    ].join(" ");
  };

  // Create segments - counter-clockwise from top
  const segments = [];

  for (let i = 0; i < maxSegments; i++) {
    const isCompleted = i < completedSegments;

    // Start at 0 (top) and go counter-clockwise (subtract angles)
    const startAngle = -(i * (segmentAngle + gapAngle));
    const endAngle = startAngle - segmentAngle;

    const pathData = describeArc(center, center, radius, startAngle, endAngle);

    segments.push(
      <Path
        key={i}
        d={pathData}
        stroke={isCompleted ? color : 'rgba(255, 255, 255, 0.2)'}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G>
          {segments}
        </G>
      </Svg>
    </View>
  );
};

export default CircularProgress;
