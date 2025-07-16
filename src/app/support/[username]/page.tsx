import SupportLayout from "../../../components/support/SupportLayout";

type Props = {
  params: {
    username: string;
  };
  searchParams: {
    challengeId?: string;
  };
};

export default function SupportPage({ params, searchParams }: Props) {
  return <SupportLayout username={params.username} challengeId={searchParams.challengeId} />;
} 