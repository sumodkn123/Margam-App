import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

interface MargamFlowerIconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

export const MargamFlowerIcon: React.FC<MargamFlowerIconProps> = ({
  size = 24,
  color = '#94A3B8',
  focused = false,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="translate(12, 12)">
        {/* 8-Petal Symmetric Blooming Flower Motif */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
          <G key={`petal-${idx}`} transform={`rotate(${angle})`}>
            <Path
              d="M 0 -2.5 C -2.2 -6 -2.4 -9.5 0 -11 C 2.4 -9.5 2.2 -6 0 -2.5 Z"
              fill={focused ? color : 'none'}
              stroke={color}
              strokeWidth={focused ? 1.6 : 1.8}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </G>
        ))}
        {/* Central Core Pistil Ring */}
        <Circle
          cx={0}
          cy={0}
          r={2.4}
          fill={focused ? '#FFFFFF' : 'none'}
          stroke={color}
          strokeWidth={1.8}
        />
        {focused && <Circle cx={0} cy={0} r={1.2} fill={color} />}
      </G>
    </Svg>
  );
};
