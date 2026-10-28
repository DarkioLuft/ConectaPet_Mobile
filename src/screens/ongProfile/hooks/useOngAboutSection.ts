import { useEffect, useState } from 'react';

export function useOngAboutSection({ initialData }: { initialData: any }) {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    console.log("ABOUT")
    console.log(initialData);
    if (initialData) {
      // setAboutData({
      //   about: initialData.about,
      //   stats: initialData.stats,
      //   address: initialData?.address,
      //   city: initialData?.addresses?.cities,
      // });
      setAboutData(initialData)
    }
  }, [initialData]);

  return { aboutData };
}