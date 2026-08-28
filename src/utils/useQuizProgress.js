import useLocalStorage from './useLocalStorage';
import { emptyProgress, recordResult, isValidProgress } from './quizProgress.mjs';

const STORAGE_KEY = 'cardano-quiz-progress';

// Quiz progress state. Instantiate ONCE per page (the hub owns it) and pass
// `record`/`progress` down as props. Separate instances do not sync with
// each other, they only share the storage key.
// Tampered or malformed stored state fails isValidProgress and is discarded.
export default function useQuizProgress() {
  const [progress, setProgress, reset] = useLocalStorage(STORAGE_KEY, emptyProgress(), isValidProgress);

  const record = (quizId, correct, total) => {
    const dateStr = new Date().toISOString().slice(0, 10);
    setProgress((prev) => recordResult(prev, quizId, correct, total, dateStr));
  };

  return { progress, record, reset };
}
