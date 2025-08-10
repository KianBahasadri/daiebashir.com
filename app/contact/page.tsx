import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Daie Bashir & Bamdad
        </h1>
        <div className="text-lg text-gray-300 leading-relaxed">
          <p>
            With a legacy of innovation and a commitment to excellence, Daie Bashir and Bamdad stand at the forefront of the industry. Their work is not just about creating solutions; it’s about setting new standards and inspiring what’s next. They believe in the power of collaboration and are dedicated to bringing visionary ideas to life.
          </p>
        </div>
        <div className="pt-4">
          <p className="text-gray-400">For inquiries, collaborations, or to learn more, please reach out.</p>
          <a
            href="mailto:daiebashir@daiebashir.com"
            className="text-2xl font-semibold text-white inline-block mt-4 p-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            daiebashir@daiebashir.com
          </a>
          <a
            href="mailto:bamdad@daiebashir.com"
            className="text-2xl font-semibold text-white inline-block mt-4 p-3 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            bamdad@daiebashir.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
