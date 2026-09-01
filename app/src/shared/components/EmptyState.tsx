import styled from "styled-components";
import { Card } from "./Card";
import Button from "./Button";

const Wrapper = styled(Card)`
  text-align: center;
  padding: 55px 20px;

  h3 {
    margin: 0;
    font-size: 21px;
  }

  p {
    max-width: 430px;
    margin: 9px auto 20px;

    color: #788279;
    line-height: 1.5;
  }
`;

const Icon = styled.div`
  font-size: 42px;
  margin-bottom: 13px;
`;

interface EmptyStateProps {
  icon: string;
  title: string;
  text: string;
  action?: () => void;
}

export const EmptyState = ({ icon, title, text, action }: EmptyStateProps) => {
  return (
    <Wrapper>
      <Icon>{icon}</Icon>

      <h3>{title}</h3>

      <p>{text}</p>

      {action && (
        <Button $variant="primary" onClick={action}>
          Genera piano
        </Button>
      )}
    </Wrapper>
  );
};
