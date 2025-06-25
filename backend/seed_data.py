from models import Question, SessionLocal, create_tables

def seed_questions():
    db = SessionLocal()
    
    # Check if questions already exist
    if db.query(Question).first():
        print("Questions already seeded")
        return
    
    questions = [
        # Psychological Safety
        Question(
            category="psychological_safety",
            text="Do you feel it's safe for everybody to share their ideas in team meetings, without getting judged or interrupted?",
            order_index=1
        ),
        Question(
            category="psychological_safety",
            text="Do you feel like everybody's contribution is valued by the other team members?",
            order_index=2
        ),
        Question(
            category="psychological_safety",
            text="Do you feel like the team can show vulnerability in front of each other, e.g. show that they don't know something, or that they have changed your mind after reading up on a subject?",
            order_index=3
        ),
        Question(
            category="psychological_safety",
            text="Do you think that the team is capable of raising and settling differing opinions in a healthy way, without lingering bad feelings?",
            order_index=4
        ),
        
        # Dependability
        Question(
            category="dependability",
            text="Do you feel like the team has the skills, tools and resources (time, budget, staffing) required to do their job?",
            order_index=1
        ),
        Question(
            category="dependability",
            text="Do you feel like the team can successfully commit to finish a certain amount of work for a certain deadline?",
            order_index=2
        ),
        Question(
            category="dependability",
            text="Do you feel like the team can hold team members accountable if they don't do their job properly?",
            order_index=3
        ),
        Question(
            category="dependability",
            text="Do you feel like the team has the necessary support from any stakeholders or outside actors you depend on?",
            order_index=4
        ),
        
        # Structure and Clarity
        Question(
            category="structure_clarity",
            text="Do you feel like you have a good understanding of the team's / project's vision and roadmap?",
            order_index=1
        ),
        Question(
            category="structure_clarity",
            text="Do you feel like the team has clear, measurable KPIs or goals, and do you know what they are?",
            order_index=2
        ),
        Question(
            category="structure_clarity",
            text="Do you feel like the roles and responsibilities in the team are clear enough to you?",
            order_index=3
        ),
        Question(
            category="structure_clarity",
            text="Is there a prioritised 'backlog' or checklist of items to accomplish?",
            order_index=4
        ),
        
        # Meaning & Impact
        Question(
            category="meaning_impact",
            text="Do you feel like working on this team can help you reach your professional or private goals?",
            order_index=1
        ),
        Question(
            category="meaning_impact",
            text="Do you feel like this team has set up goals that are useful for your organisation / client / end-users?",
            order_index=2
        ),
        Question(
            category="meaning_impact",
            text="Do you feel like your work is impacting the team positively?",
            order_index=3
        ),
        Question(
            category="meaning_impact",
            text="Do you feel like the team's work is impacting the organisation / client / end-users positively?",
            order_index=4
        ),
    ]
    
    for question in questions:
        db.add(question)
    
    db.commit()
    db.close()
    print("Questions seeded successfully")

if __name__ == "__main__":
    create_tables()
    seed_questions()