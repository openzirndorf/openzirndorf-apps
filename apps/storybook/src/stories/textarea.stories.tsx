import { Textarea } from "@openzirndorf/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Foundation/Textarea",
  component: Textarea,
  args: {
    placeholder: "Beschreibe kurz, was du anbietest",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: "Kinderbücher, Spielsachen und ein paar Werkzeuge aus der Garage.",
  },
};