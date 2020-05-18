import gql from 'graphql-tag';

export const FEED_ITEM_EDITING_COMMENT_FRAGMENT = gql`
  fragment FeedItemEditingComment on FeedItemComment {
    id
    content
  }
`;

export const CREATE_FEED_ITEM_COMMENT_MUTATION = gql`
  mutation CreateFeedItemComment($feedItemId: ID!, $content: String!) {
    createFeedItemComment(
      input: { feedItemId: $feedItemId, content: $content }
    ) {
      feedItemComment {
        id
        content
      }
    }
  }
`;

export const UPDATE_FEED_ITEM_COMMENT_MUTATION = gql`
  mutation UpdateFeedItemComment($commentId: ID!, $content: String!) {
    updateFeedItemComment(input: { id: $commentId, content: $content }) {
      feedItemComment {
        id
        content
      }
    }
  }
`;
