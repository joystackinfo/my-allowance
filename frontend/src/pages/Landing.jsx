import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const Landing = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        // fade in animation on load
        heroRef.current.classList.add('hero-visible');
    }, []);

    return (
        <div className="landing">

            {/* NAVBAR */}
            <nav className="landing-nav">
                <span className="landing-nav-brand">MyAllowance</span>
                <div className="landing-nav-links">
                    <Link to="/login">Log in</Link>
                    <Link to="/signup" className="btn-primary">Get started free</Link>
                </div>
            </nav>

            {/* HERO */}
            <div className="landing-hero" ref={heroRef}>

                {/* LEFT */}
                <div className="landing-left">
                    <div className="landing-badge">
                        Helping your allowance survive the week
                    </div>
                    <h1>Stop wondering<br />where your<br />money went.</h1>
                    <p>MyAllowance tracks every naira — so you can spend with intention, save with purpose, and never go broke on a Monday again.</p>

                    <div className="landing-features">
                        <div className="landing-feature">
                            <span>📊</span>
                            <span>Track income and spending weekly</span>
                        </div>
                        <div className="landing-feature">
                            <span>🎯</span>
                            <span>Set savings goals and watch them grow</span>
                        </div>
                        <div className="landing-feature">
                            <span>⚠️</span>
                            <span>Get alerted before you go broke</span>
                        </div>
                    </div>

                    <div className="landing-cta">
                        <Link to="/signup" className="btn-primary">Start tracking free</Link>
                        <p className="landing-login">Already have an account? <Link to="/login">Log in</Link></p>
                    </div>
                </div>

                {/* RIGHT - App preview */}
                <div className="landing-right">
                    <div className="app-preview">
                        <div className="preview-nav">
                            <span>MyAllowance</span>
                            <span className="preview-greeting">Hi Student 👋</span>
                        </div>
                        <div className="preview-body">

                            {/* Balance */}
                            <div className="preview-balance">
                                <p>This week's balance</p>
                                <h2>₦1,850</h2>
                                <div className="preview-balance-bar">
                                    <div className="preview-balance-fill" style={{width: '72%'}}></div>
                                </div>
                                <span>72% of ₦2,500 remaining</span>
                            </div>

                            {/* Cards */}
                            <div className="preview-cards">
                                <div className="preview-card income">
                                    <p>Income</p>
                                    <h3>₦2,500</h3>
                                </div>
                                <div className="preview-card expense">
                                    <p>Spent</p>
                                    <h3>₦650</h3>
                                </div>
                            </div>

                            {/* Recent transactions */}
                            <div className="preview-transactions">
                                <p className="preview-section-title">Today's spending</p>
                                <div className="preview-tx">
                                    <div className="preview-tx-left">
                                        <span className="preview-tx-icon">🍔</span>
                                        <div>
                                            <p className="preview-tx-name">Suya</p>
                                            <p className="preview-tx-cat">Food</p>
                                        </div>
                                    </div>
                                    <span className="preview-tx-amount expense">-₦500</span>
                                </div>
                                <div className="preview-tx">
                                    <div className="preview-tx-left">
                                        <span className="preview-tx-icon">📱</span>
                                        <div>
                                            <p className="preview-tx-name">MTN Data</p>
                                            <p className="preview-tx-cat">Airtime</p>
                                        </div>
                                    </div>
                                    <span className="preview-tx-amount expense">-₦150</span>
                                </div>
                                <div className="preview-tx">
                                    <div className="preview-tx-left">
                                        <span className="preview-tx-icon">💰</span>
                                        <div>
                                            <p className="preview-tx-name">Weekly allowance</p>
                                            <p className="preview-tx-cat">Income</p>
                                        </div>
                                    </div>
                                    <span className="preview-tx-amount income">+₦2,500</span>
                                </div>
                            </div>

                            {/* Goal */}
                            <div className="preview-goal">
                                <div className="preview-goal-header">
                                    <span>🪙 Saving for AirPods Pro 🎧</span>
                                    <span className="preview-goal-percent">35%</span>
                                </div>
                                <div className="preview-progress">
                                    <div className="preview-progress-bar"></div>
                                </div>
                                <p>₦7,000 of ₦20,000</p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
    };

export default Landing;