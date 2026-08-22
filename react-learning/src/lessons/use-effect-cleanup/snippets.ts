export const badFetchSnippet = `useEffect(() => {
  setBio(null);
  fetchBio(person).then(result => {
    setBio(result);
  });
}, [person]);`;

export const goodIgnoreSnippet = `useEffect(() => {
  let ignore = false;
  setBio(null);
  fetchBio(person).then(result => {
    if (!ignore) {
      setBio(result);
    }
  });
  return () => {
    ignore = true;
  };
}, [person]);`;

export const goodAbortSnippet = `useEffect(() => {
  const controller = new AbortController();
  let ignore = false;

  async function startFetching() {
    setBio(null);
    try {
      const result = await fetchBio(person, {
        signal: controller.signal,
      });
      if (!ignore) {
        setBio(result);
      }
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }
      throw error;
    }
  }

  startFetching();
  return () => {
    ignore = true;
    controller.abort();
  };
}, [person]);`;
