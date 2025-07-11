import UserProfileLayout from "../../../components/user-profile/UserProfileLayout";

type Props = {
  params: {
    username: string;
  };
};

export default function UserProfilePage({ params }: Props) {
  return <UserProfileLayout />;
} 