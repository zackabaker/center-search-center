import { RoomHead } from '../ui';
import TutorSearch from './TutorSearch';

// /analytics/tutor — the tutor's retrieval, on its own, before any model is
// attached: what a question pulls out of the archive, paragraph by paragraph.

export default function TutorRoom() {
  return (
    <>
      <RoomHead title="Tutor search">
        What the tutor would be shown for a question: the paragraphs of the Katz texts that best match its words and its meaning. Each line shows where the paragraph ranked on each, so a bad result can be traced to its cause.
      </RoomHead>
      <TutorSearch />
    </>
  );
}
