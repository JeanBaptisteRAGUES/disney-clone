import Link from 'next/Link';
import Image from 'next/Image';
import logo from '../public/disney.png';

const Navbar = ({account}) => {
  return (
    <div className="navbar">
        <div className="logo-wrapper">
          <Link href="/" legacyBehavior ><a><Image src={logo} alt="Disney Logo" width={90} height={50} /></a></Link>
        </div>
        <div className="account-info">
          <p>Welcome {account.username}</p>
          <img src={account.avatar.url} alt="Profile picture" className="avatar" />
        </div>
    </div>
  )
}

export default Navbar;