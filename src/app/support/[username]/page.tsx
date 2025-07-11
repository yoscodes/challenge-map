import SupportLayout from "../../../components/support/SupportLayout";

type Props = {
  params: {
    username: string;
  };
};

export default function SupportPage({ params }: Props) {
  return <SupportLayout />;
} 