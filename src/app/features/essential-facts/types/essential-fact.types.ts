export interface EssentialFactRequest {
  id?: string;
  name?: string;
  category?: string;
}

export interface EssentialFact {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}
