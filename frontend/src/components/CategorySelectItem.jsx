import { Group, Text, ThemeIcon } from "@mantine/core";
import { forwardRef, useMemo } from "react";
import { Icons } from "../constants/categories";

function CategorySelectItem({ label, value, icon, color, ...rest }, ref) {
  const Icon = useMemo(() => Icons[icon], [icon]);
  return (
    <div ref={ref} {...rest}>
      <Group noWrap spacing="xs">
        <ThemeIcon color={color} variant="light">
          <Icon size={16} />
        </ThemeIcon>

        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  );
}

export default forwardRef(CategorySelectItem);
