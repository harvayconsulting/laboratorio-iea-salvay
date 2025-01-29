import { differenceInDays, parseISO } from 'date-fns';

export const calculateDays = (startDate: string, endDate: string) => {
  return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-AR');
};