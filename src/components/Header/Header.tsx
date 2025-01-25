import News from '@c/News';
import Logo from './Logo';
import Clock from './Clock';

interface HeaderProps {
	message: string;
}
const Header = ({ message }: HeaderProps) => {
	return (
		<>
			<Logo />
			<div className='center flex max-w-md items-center'>
				<News />
				<span>{message}</span>
			</div>
			<Clock />
		</>
	);
};

export default Header;
