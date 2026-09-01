import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "danger" | "plain";

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: #23863b;
    color: white;

    &:hover {
      background: #1c7131;
    }
  `,
  secondary: css`
    background: #e9eeea;
    color: #334138;
  `,
  danger: css`
    background: #fff0ef;
    color: #b3342e;
  `,
  plain: css``,
};

export const Button = styled.button<{ $variant?: ButtonVariant }>`
  border: 0;
  border-radius: 12px;
  padding: 12px 17px;
  font-weight: 800;
  transition: 0.15s ease;

  ${({ $variant = "plain" }) => variantStyles[$variant]}

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
    transform: none;
  }
`;

export default Button;
