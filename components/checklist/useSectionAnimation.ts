import { useRef, useState, useEffect, useMemo } from "react";
import { Animated } from "react-native";

type UseSectionAnimationResult = {
  renderBody: boolean;
  bodyAnimationStyle: {
    opacity: Animated.Value;
    transform: { scaleY: Animated.AnimatedInterpolation<string | number> }[];
  };
  arrowAnimationStyle: {
    transform: { rotate: Animated.AnimatedInterpolation<string | number> }[];
  };
};

export function useSectionAnimation(
  isExpanded: boolean
): UseSectionAnimationResult {
  const animation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const [renderBody, setRenderBody] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) {
      setRenderBody(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setRenderBody(false);
        }
      });
    }
  }, [animation, isExpanded]);

  const bodyAnimationStyle = useMemo(
    () => ({
      opacity: animation,
      transform: [
        {
          scaleY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.96, 1],
          }),
        },
      ],
    }),
    [animation]
  );

  const arrowAnimationStyle = useMemo(
    () => ({
      transform: [
        {
          rotate: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"],
          }),
        },
      ],
    }),
    [animation]
  );

  return {
    renderBody,
    bodyAnimationStyle,
    arrowAnimationStyle,
  };
}
