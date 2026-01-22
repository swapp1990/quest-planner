import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CircularProgress = ({
  size = 140,
  strokeWidth = 8,
  progress = 0,
  maxSegments = 5,
  color = '#fff',
}) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Calculate angles for segments
  const gapAngle = 8; // degrees between segments (smaller for cleaner look)
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

    // Animated opacity for smooth transitions
    const opacity = animatedProgress.interpolate({
      inputRange: [(i / maxSegments) * 100, ((i + 1) / maxSegments) * 100],
      outputRange: [0.2, 1],
      extrapolate: 'clamp',
    });

    segments.push(
      <AnimatedPath
        key={i}
        d={pathData}
        stroke={isCompleted ? color : 'rgba(255, 255, 255, 0.15)'}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        opacity={isCompleted ? opacity : 1}
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
