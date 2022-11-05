import { gql, GraphQLClient} from 'graphql-request';
import Navbar from '../components/Navbar';
import Section from '../components/Section';

export const getStaticProps = async () => {
  const url = process.env.ENDPOINT;
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization" : process.env.GRAPH_CMS_TOKEN
    }
  });

  const videosQuery = gql`
    query Videos {
      videos {
        createdAt,
        id,
        title,
        description,
        seen,
        slug,
        tags,
        thumbnail {
          url
        },
        mp4 {
          url
        }
      }
    }
  `;

  const accountQuery = gql`
    query {
      account(where: { id: "cla1st3ne0k180auo53gy2xbh"}) {
        username,
        avatar {
          url
        }
      }
    }
  `;

  const data = await graphQLClient.request(videosQuery);
  const videos = data.videos;

  const accountData = await graphQLClient.request(accountQuery);
  const account = accountData.account;

  return {
    props: {
      videos,
      account
    }
  }
}

const Home = ({videos, account}) => {
  
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)];
  }

  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre));
  }

  const unSeenVideos = (videos) => {
    return videos.filter(video => !video.seen || video.seen === null);
  }

  const myVideo = randomVideo(videos);

  return (
    <>
      <Navbar account={account} />
      <div className="app">
        <div className="main-video">
          <img src={myVideo.thumbnail.url} alt={myVideo.title} />
        </div>
        <div className="video-feed">
          <Section genre={'Recommanded for you'} videos={unSeenVideos(videos)} />
          <Section genre={'Family'} videos={filterVideos(videos, 'family')} />
          <Section genre={'Thriller'} videos={filterVideos(videos, 'thriller')} />
          <Section genre={'Classic'} videos={filterVideos(videos, 'classic')} />
          <Section genre={'Pixar'} videos={filterVideos(videos, 'pixar')} />
          <Section genre={'Marvel'} videos={filterVideos(videos, 'marvel')} />
          <Section genre={'National Geographic'} videos={filterVideos(videos, 'national-geographic')} />
          <Section genre={'Disney'} videos={filterVideos(videos, 'disney')} />
          <Section genre={'Star Wars'} videos={filterVideos(videos, 'star-wars')} />
        </div>
      </div>
    </>
  )
}

export default Home;
