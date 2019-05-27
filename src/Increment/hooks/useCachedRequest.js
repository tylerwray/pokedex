import { useEffect, useState } from "react";
import Axios from "axios";

import cache from "../lib/cache";

export default function useCachedRequest(url) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoading(true);

    const cachedData = cache.get(url);

    if (cachedData) {
      setLoading(false);
      setData(cachedData);

      return;
    }

    Axios.get(url).then(({ data }) => {
      cache.set(url, data);
      setLoading(false);
      setData(data);
    });
  }, [url]);

  return { loading, data };
}
