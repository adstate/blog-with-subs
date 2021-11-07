export interface AddCommentResponse {
  id: number;
  postId: number;
  userId: number;
  comment: string;
  created: Date;
}
