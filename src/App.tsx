import React, { useState } from 'react';
import { BackgroundLayers } from './components/BackgroundLayers';
import { Header } from './components/Header';
import { HeroInvitation } from './components/HeroInvitation';
import { RegistrationForm } from './components/RegistrationForm';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { Footer } from './components/Footer';
import { SubmittedRegistration } from './types';

const App: React.FC = () => {
  const [submission, setSubmission] = useState<SubmittedRegistration | null>(null);

  const scrollToForm = () => {
    document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSuccess = (data: SubmittedRegistration) => {
    setSubmission(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSubmission(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: '#0C0A0E', color: '#EDE2D0' }}>
      <BackgroundLayers />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onScrollToForm={scrollToForm} />
        <main className="flex-1">
          {submission ? (
            <SubmissionSuccess data={submission} onReset={handleReset} />
          ) : (
            <>
              <HeroInvitation onScrollToForm={scrollToForm} />
              <RegistrationForm onSuccessfulSubmission={handleSuccess} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
