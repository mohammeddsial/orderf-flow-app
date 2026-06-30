import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');

interface WaveNotchProps {
  width?: number;
  height: number;
  notchRadius: number;
  backgroundColor: string;
  notchColor?: string;
}

export const WaveNotch: React.FC<WaveNotchProps> = ({
  width = SCREEN_W,
  height,
  notchRadius,
  backgroundColor,
  notchColor = 'transparent',
}) => {
  const cx = width / 2;
  const notchW = notchRadius * 2;

  const path = `
    M 0 0
    L ${cx - notchW} 0
    C ${cx - notchW * 0.5} 0, ${cx - notchW * 0.5} ${notchRadius * 1.2}, ${cx} ${notchRadius * 1.2}
    C ${cx + notchW * 0.5} ${notchRadius * 1.2}, ${cx + notchW * 0.5} 0, ${cx + notchW} 0
    L ${width} 0
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Path d={path} fill={backgroundColor} />
      </Svg>
    </View>
  );
};

export default WaveNotch;
