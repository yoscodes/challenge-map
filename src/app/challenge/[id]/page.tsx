import ChallengeDetailLayout from "../../../components/challenge-detail/ChallengeDetailLayout";

type Props = {
  params: {
    id: string;
  };
};

export default function ChallengeDetailPage({ params }: Props) {
  return <ChallengeDetailLayout />;
} 