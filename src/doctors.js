export const doctors = [
  { id: 1, name: 'Dr. med. Anke Müller', specialty: 'Allgemeinmedizin', city: 'Berlin' },
  { id: 2, name: 'Dr. med. dent. Peter Schmidt', specialty: 'Zahnarzt', city: 'Berlin' },
  { id: 3, name: 'Dr. med. Sabine Wagner', specialty: 'Augenarzt', city: 'Berlin' },
  { id: 4, name: 'Dr. med. Klaus Weber', specialty: 'Allgemeinmedizin', city: 'Hamburg' },
  { id: 5, name: 'Dr. med. dent. Julia Becker', specialty: 'Zahnarzt', city: 'Hamburg' },
  { id: 6, name: 'Dr. med. Michael Koch', specialty: 'Orthopäde', city: 'Hamburg' },
  { id: 7, name: 'Dr. med. Andreas Richter', specialty: 'Allgemeinmedizin', city: 'München' },
  { id: 8, name: 'Dr. med. dent. Laura Klein', specialty: 'Zahnarzt', city: 'München' },
  { id: 9, name: 'Dr. med. Thomas Wolf', specialty: 'Augenarzt', city: 'München' },
  { id: 10, name: 'Dr. med. Susanne Neumann', specialty: 'Orthopäde', city: 'München' },
  { id: 11, name: 'Dr. med. Markus Schulz', specialty: 'Allgemeinmedizin', city: 'Köln' },
  { id: 12, name: 'Dr. med. dent. Birgit Lehmann', specialty: 'Zahnarzt', city: 'Köln' },
];

export const specialties = [...new Set(doctors.map(doc => doc.specialty))];
export const cities = [...new Set(doctors.map(doc => doc.city))];