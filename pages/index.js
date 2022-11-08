import { gql, GraphQLClient} from 'graphql-request';
import Link from 'next/Link';
import Image from 'next/Image';
import Navbar from '../components/Navbar';
import Section from '../components/Section';
import disneyLogo from '../public/disney-button.png';
import pixarLogo from '../public/pixar-button.png';
import marvelLogo from '../public/marvel-button.png';
import natgeoLogo from '../public/natgeo-button.png';
import starwarsLogo from '../public/star-wars-button.png';


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

  console.log(disneyLogo);

  return (
    <>
      <Navbar account={account} />
      <div className="app">
        <div className="main-video">
          <img src={myVideo.thumbnail.url} alt={myVideo.title} />
        </div>
        <div className="video-feed">
          <Link href="#disney" legacyBehavior><div className="franchise" id="disney"><Image src={disneyLogo} alt="Disney"></Image></div></Link>
          <Link href="#pixar" legacyBehavior><div className="franchise" id="pixar"><Image src={pixarLogo} alt="Pixar"></Image></div></Link>
          <Link href="#star-wars" legacyBehavior><div className="franchise" id="star-wars"><Image src={starwarsLogo} alt="Star-Wars"></Image></div></Link>
          <Link href="#nat-geo" legacyBehavior><div className="franchise" id="nat-geo"><Image src={natgeoLogo} alt="National-Geographic"></Image></div></Link>
          <Link href="#marvel" legacyBehavior><div className="franchise" id="marvel"><Image src={marvelLogo} alt="Marvel"></Image></div></Link>
        </div>
        <Section genre={'Recommanded for you'} videos={unSeenVideos(videos)} />
        <Section genre={'Family'} videos={filterVideos(videos, 'family')} />
        <Section genre={'Thriller'} videos={filterVideos(videos, 'thriller')} />
        <Section genre={'Classic'} videos={filterVideos(videos, 'classic')} />
        <Section id="pixar" genre={'Pixar'} videos={filterVideos(videos, 'pixar')} />
        <Section id="marvel" genre={'Marvel'} videos={filterVideos(videos, 'marvel')} />
        <Section id="nat-geo" genre={'National Geographic'} videos={filterVideos(videos, 'national-geographic')} />
        <Section id="disney" genre={'Disney'} videos={filterVideos(videos, 'disney')} />
        <Section id="star-wars" genre={'Star Wars'} videos={filterVideos(videos, 'star-wars')} />
      </div>
    </>
  )
}

export default Home;
