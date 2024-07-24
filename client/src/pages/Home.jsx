import React from "react";
import Navigation from "../components/Navigation";
import "../styles/Home.css";
import { useRequireAuth } from "../authentication/AuthCheck";

function Home() {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <div>
        <Navigation></Navigation>
        <div className="about-container">
          <h1>Description</h1>
          <p>
            Welcome to our Channel-Based Tool for Programming Issues, a
            dedicated platform designed to foster a collaborative environment
            for programmers of all levels. Our mission is to provide a
            streamlined space where users can seamlessly engage with programming
            questions, share insightful answers, and create a thriving community
            centered around coding excellence.
          </p>
          <h2>Key Features</h2>
          <p>
            Our platform revolves around the concept of channels, offering users
            the ability to create, explore, and participate in discussions
            tailored to specific programming topics. Whether you're a seasoned
            developer seeking to share your expertise or a coding enthusiast
            looking for guidance, our Channel-Based Tool facilitates meaningful
            interactions.
          </p>
          <h2>Post Programming Questions:</h2>
          <p>
            Users can leverage our platform to pose programming questions,
            tapping into the collective knowledge of the community. This feature
            serves as a valuable resource for those facing coding challenges,
            creating an inclusive space for knowledge-sharing and
            problem-solving.
          </p>
          <h2>Provide Answers/Responses:</h2>
          <p>
            Contribute to the growth of our programming community by sharing
            your expertise. Users can provide detailed answers and responses to
            programming queries, fostering a culture of collaboration and
            mentorship.
          </p>
          <h2>Create Channels:</h2>
          <p>
            Tailor your experience by creating channels dedicated to specific
            programming languages, frameworks, or topics of interest. Our
            platform allows users to not only view all existing channels but
            also create new ones, ensuring that discussions are organized and
            accessible.
          </p>
          <h2>Channel Interaction:</h2>
          <p>
            Navigate through the diverse array of channels to find the
            discussions that align with your interests. Select a channel to post
            messages, sharing your thoughts, code snippets, or inquiries with
            the community. Engage in dynamic conversations by posting replies to
            existing messages, creating a threaded dialogue that enhances the
            learning experience.
          </p>
          <p>
            At the heart of our Channel-Based Tool is the belief that
            collaboration fuels innovation. Join us on this coding journey,
            where every question asked, answer shared, and channel created
            contributes to the growth and enrichment of our programming
            community. Thank you for being a part of this dynamic and inclusive
            space for programming enthusiasts.
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
