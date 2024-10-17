"use client";

import "./index.css";
import TopNavigation from "./components/TopNavigation";

export default function landing() {
  return (
    <div className="landing">
      <main>
        <TopNavigation />
        <div className="main-content">
          <div>
            <h1>
              <span>Track</span>
              <span>Plan</span>
              <span>Save</span>
            </h1>
            <p>
              Track expenses, plan ahead, and save more—simplify your finances
            </p>
          </div>
          <div className="cards">
            <div className="card">
              <h2>Track Your Spending</h2>
              <p>
                Get real-time insights into where your money goes. Categorize
                expenses and monitor spending habits effortlessly.
              </p>
            </div>
            <div className="card">
              <h2>Plan Your Budget</h2>
              <p>
                Set financial goals and create personalized budgets. Plan ahead
                and stay on track with smart alerts and reminders.
              </p>
            </div>
            <div className="card">
              <h2>Save Smarter</h2>
              <p>
                Discover savings opportunities and optimize your finances.
                Achieve your savings goals with automated tips and strategies.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
