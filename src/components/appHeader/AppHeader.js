import './appHeader.scss';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <a href="https://www.marvel.com/corporate/advertising">
                    <span>Marvel</span> information portal
                </a>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><a href="https://www.marvel.com/characters">Characters</a></li>
                    /
                    <li><a href="https://www.marvel.com/comics?&options%5Boffset%5D=0&totalcount=12">Comics</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;