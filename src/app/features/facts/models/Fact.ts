export interface Fact {
  id: number;
  organization_name: string;
  organization_short_name: string;
  pub_date: string;
  fact_title: string;
  fact_short_title?: string;
  fact_number: number;
  object_id: number;
  status: string;
  watched: number;
  approved_date: string;
  organization: number;
  author: string;
  content_type: number;
}
