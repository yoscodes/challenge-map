import Header from "../components/top/Header";
import HeroMessage from "../components/top/HeroMessage";
import SearchBar from "../components/top/SearchBar";
import MainLayout from "../components/top/MainLayout";
import ChallengeList from "../components/top/ChallengeList";
import CTAButton from "../components/top/CTAButton";

export default function HomePage() {
  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 0' }}>
        <HeroMessage />
        <SearchBar />
        <MainLayout />
        <ChallengeList />
        <CTAButton />
      </main>
    </div>
  );
}
