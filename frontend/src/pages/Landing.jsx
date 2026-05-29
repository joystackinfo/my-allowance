import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing">

            <div className="landing-left">
                <div className="landing-badge">Built for Nigerian students 🇳🇬</div>
                <h1>Your money.<br />Your rules.</h1>

                <p>Track your allowance, understand your spending, and reach your savings goals — all in one place.</p>
                <Link to="/signup" className="btn-primary">Start tracking free</Link>
                <p className="landing-login">Already have an account? <Link to="/login">Log in</Link></p>
            </div>

            <div className="landing-right">
                <div className="app-preview">
                    <div className="preview-nav">MyAllowance</div>
                    <div className="preview-body">
                        <div className="preview-balance">
                            <p>This week's balance</p>
                            <h2>₦1,850</h2>
                        </div>

                        <div className="preview-cards">
                            <div className="preview-card income">
                                <p>Income</p>
                                <h3>₦2,000</h3>
                            </div>

                            <div className="preview-card expense">
                                <p>Spent</p>
                                <h3>₦150</h3>
                            </div>
                        </div>

                        <div className="preview-goal">
                            <p>Saving for AirPods 🎧</p>
                            <div className="preview-progress">
                                <div className="preview-progress-bar"></div>
                            </div>
                            <p>₦7,000 of ₦20,000</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Landing;