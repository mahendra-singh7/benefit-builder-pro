## Benefit Builder (SOW)

Project Objective: To deliver a high-performance, gamified benefit builder platform consisting of a Web-based Admin Command Center and a Multi-user Android Tablet Application for a live event on Jan 15, 2025 .

## 1. Functional Scope: Web Admin Panel (The Command Center)

The Admin Panel is a secure, web-based suite for managing the entire game ecosystem.

## A. Benefit/Blocks Library Management (CRUD)

The primary database for the game's "building blocks."

- Creation Interface: Admin can add benefits with five mandatory attributes:
- o Category: Grouping (e.g., Health, Wellness, Financial ).
- o Benefit Name: Specific title (e.g., Full Medical Cover ).
- o Cost ($): The financial "weight" subtracted from the team budget.
- o Happiness Points (HP): The score value added to the team's meter.
- o Block Size: The physical footprint (e.g., 1x1, 2x1, 2x2 ) that determines how much space it occupies on the player's grid.
- Management: Ability to edit existing values or delete outdated benefits instantly.

## B. Event Management (CRUD)

The ability to create and customize unique game "sessions."

- Event Configuration: Setup unique parameters: Event Name, Date, Total Teams, Max Players per Team.
- Constraint Setting: Define the Total Budget and the Game Timer Duration (e.g., 15:00 minutes).
- Library Override: A "Cloning" feature. Admin can select a master library and then change the Cost or HP of specific benefits only for this event , allowing for balance adjustments without affecting other sessions.
- Rules Engine: A text editor where Admin inputs the rules/instructions that will pop up on the player tablets on the waiting screen before they start.
- Event Details: A screen to be accessed by the admin for event details like (event basic details, leader boards, team details, etc.)

## C. Live Operations, Lobby &amp; Dashboard

- Waiting Lobby: A real-time monitor showing which teams have successfully logged in and are "Ready."
- Global Controls: Start, Pause, and Restart buttons. Clicking "Start" sends a signal to all tablets to unlock the grid and begin the countdown timer simultaneously.
- Team Details: A dashboard showing live data for every team:
- o Team names
- o Current Budget used vs. remaining
- o Current Happiness Score accumulated
- o List of selected benefits
- o Team member names
- Live Leaderboard: A dedicated, high-resolution view optimized for projector screens. It dynamically manages teams' positions by Happiness Score in real-time as they play.

## 2. Functional Scope: Android Game App (The Player Experience)

A touch-optimized application designed for 3-person collaboration on a single device.

## A. Team Onboarding &amp; Waiting Room

- Authentication: Players enter the unique Event ID provided by the Admin.
- Participant Entry: A screen to input the names of all players for recognition on the leaderboard.
- Rules View: Upon entry, a mandatory popup displays the game rules/instructions set by the Admin.
- Synced Waiting State: A locked screen showing a "Get Ready" message until the admin triggers the global "Start."

## B. The Gameplay Workspace (The Canvas)

- Heads-Up Display (HUD):
- o Timer: A ticking countdown synced with the admin clock.
- o Total Budget: A progress bar that drains as blocks are added.
- o Happiness Meter: A gauge that fills as points are earned.
- Categorized Drawer: A sliding menu where players can browse benefits by category.
- The Grid (Interactive Canvas): A coordinate-based workspace where teams drag, drop, and snap benefit blocks.
- Dynamic Editing:
- o Move: Drag a block to a different spot on the grid.
- o Remove: A "Trash" icon or long-press action that deletes a block, instantly returning the cost to the budget and removing the points.

## C. Final Submission &amp; Result Screen

- The Submission Logic: A "Lock-In" button that only becomes active when the team is satisfied with their package.
- Validation Check: Before accepting a submission, the app performs a final audit:
- o Is the team within budget?
- o Is the timer still running?
- Submission Action: Once pressed, the app locks the screen, stops the team's timer, and sends the final package data to the admin for the leaderboard.
- Result Summary: Players see a "Congratulations" screen showing their final Total Score , Money Saved , and Package Efficiency.

## 3. Core Logic: The "Trade-Off" Engine

The "Trade-Off" is the mechanical heart of the simulator. It is governed by the following strict backend logic:

1. The Budget Constraint: The system maintains a real-time calculation: Event Budget - Sum (Placed Benefits Cost).
2. The Penalty State: If a team adds a benefit that exceeds the budget:
- a. The Budget Meter turns Bright Red .
- b. An "Over Budget" warning appears.
- c. The "Submit" button is hard-disabled (cannot be pressed).
3. The Trade-Off Action: The team is forced to discuss and perform a "Trade-Off"either removing an existing expensive block or "downgrading" it to a cheaper version-to bring the budget back to &gt;= 0.
4. The Tiebreaker (Efficiency): If two teams have the same Happiness Score, the team with the most Remaining Budget (highest efficiency) wins the tie.

## 4. Hardware &amp; Technical Requirements

- •

- Display: 10.1" - 11.0" Screen (Minimum 5-point multi-touch).

- OS: Android 15.0 or higher.

- RAM:

- 8GB Recommended.

- Connectivity:

- Wi-Fi

## 5. Project Roadmap &amp; Deliverables

| Date        | Milestones                                                                                          | Key Deliverables                                              |
|-------------|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| Jan 2       | Demo1 GameUI: Grid UI, and Drag-and-Drop mechanics.                                                 | Team Login,                                                   |
| Demo2       | Admin MVPUIandBackendWork: Benefit Library, CRUD, Event Creation.                                   | Jan 6                                                         |
| Jan 8 Demo3 | Integration: Dashboard and Overall Integrations of Live Leaderboard.                                |                                                               |
| Jan 9       | Sign-off and Client UAT: Final bug fixes, Feedback changes suggested by client, and stress testing. | Client UAT                                                    |
| 13 Delivery | Delivery Handover with Final Fixes.                                                                 | Jan                                                           |
| Setup       | Online Prep: Android Tablet staging and venue Wi-Fi connectivity testing done by the client.        | Jan 14                                                        |
| Jan 15      | Event Day                                                                                           | Live Execution: Online technical support during the activity. |

## 6. Project Assumptions &amp; Dependencies

These factors are critical to the successful delivery of the project within the 10-day timeline.

| Category                | Assumption Detail                                                                                                                                                                         |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Client Deliverables     | The Client will provide all final Benefit Data (Categories, Names, Costs, Points) and Event Branding (Logos/Color codes) by Jan 3rd to ensure an accurate population of the Demo2build. |
| Hardware Provision      | The Client is responsible for providing tablets that meet or exceed the Minimum Specifications (Android 15.0 or higher, 10.1" Screen) unless otherwise agreed.                            |
| Network Stability       | The Venue must provide a stable Wi-Fi connection (minimum 10Mbps up/down) to support real-time synchronization between the tablets and the Admin Dashboard.                               |
| Review Turnaround       | To maintain the sprint cycle, the Client agrees to provide feedback within 4 hours of each Demo(Jan 2, 6, 8) to allow for immediate iteration.                                            |
| Single Point of Contact | The Client will designate one Decision Maker for the UAT (Jan 9th) to avoid conflicting requirements during the final polish phase.                                                     |
| Power Logistics         | For the event on Jan 15th, the Client will ensure all tablets are fully charged (100%) or provide access to power banks/charging stations at the team tables.                           |