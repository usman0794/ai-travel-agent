export const getTripImage = (destination) => {
  const city = destination?.toLowerCase() || "";

  if (city.includes("lahore")) {
    return "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80";
  }

  if (city.includes("islamabad")) {
    return "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80";
  }

  if (city.includes("kashmir") || city.includes("srinagar")) {
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80";
  }

  return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
};
