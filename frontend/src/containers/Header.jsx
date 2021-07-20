import styled from 'styled-components';
import { Link } from "react-router-dom";
import MainLogo from '../images/logo.png';

const HeaderWrapper = styled.div`
display: flex;
justify-content: flex-start;
padding: 8px 32px;
`;

const MainLogoImage = styled.img`
height: 90px;
`;

export const Header = () => {
  return (
    <HeaderWrapper>
      <Link to="/restaurants">
        <MainLogoImage src={MainLogo}/>
      </Link>
    </HeaderWrapper>
  )
}