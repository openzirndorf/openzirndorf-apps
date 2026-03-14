import { Input } from "@openzirndorf/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Foundation/Input",
  component: Input,
  args: {
    placeholder: "Stadtteil oder Titel",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Zirndorf Nord",
  },
};