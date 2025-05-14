import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-blue-600 p-4 text-white w-full">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                
                <div className="flex items-center justify-between w-full md:w-auto">

                    <div className="text-lg font-bold">
                        MySite
                    </div>
                
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-2xl ml-4"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? '✖' : '☰'}
                    </button>
                </div>

                <nav className={`w-full md:w-auto ${menuOpen ? "block" : "hidden"} md:block`}>
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mt-2 md:mt-0">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'underline font-bold' : ''} onClick={() => setMenuOpen(false)}>
                            Начало
                        </NavLink>
                        <NavLink to="/appointments" className={({ isActive }) => isActive ? 'underline font-bold' : ''} onClick={() => setMenuOpen(false)}>
                            Запази час
                        </NavLink>
                        <NavLink to="/questions" className={({ isActive }) => isActive ? 'underline font-bold' : ''} onClick={() => setMenuOpen(false)}>
                            Въпроси
                        </NavLink>
                        <NavLink to="/comments" className={({ isActive }) => isActive ? 'underline font-bold' : ''} onClick={() => setMenuOpen(false)}>
                            Коментари
                        </NavLink>
                        <NavLink to="/register" className={({ isActive }) => isActive ? 'underline font-bold' : ''} onClick={() => setMenuOpen(false)}>
                            Регистрация
                        </NavLink>
                        <NavLink to="/login" className={({ isActive }) => isActive ? 'underline font-bold' : ''} onClick={() => setMenuOpen(false)}>
                            Вход
                        </NavLink>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;