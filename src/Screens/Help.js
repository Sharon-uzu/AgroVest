import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Header2 from '../Components/Header2';
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

// Define the Faq array before using it
const Faq = [
  {
    id: 1,
    question: 'What is Agrovest?',
    answer: 'Techtan is a premier tech hub designed to provide tailored tech training programs for grownups, working-class professionals, and individuals seeking to enhance their tech skills in a clean, calm, and classy environment.',
  },
  {
    id: 2,
    question: '2What is Agrovest?',
    answer: '2Techtan is a premier tech hub designed to provide tailored tech training programs for grownups, working-class professionals, and individuals seeking to enhance their tech skills in a clean, calm, and classy environment.',
  },
  {
    id: 3,
    question: '3What is Agrovest?',
    answer: '3Techtan is a premier tech hub designed to provide tailored tech training programs for grownups, working-class professionals, and individuals seeking to enhance their tech skills in a clean, calm, and classy environment.',
  },
  {
    id: 4,
    question: '4What is Agrovest?',
    answer: '4Techtan is a premier tech hub designed to provide tailored tech training programs for grownups, working-class professionals, and individuals seeking to enhance their tech skills in a clean, calm, and classy environment.',
  },
  {
    id: 5,
    question: '5What is Agrovest?',
    answer: '5Techtan is a premier tech hub designed to provide tailored tech training programs for grownups, working-class professionals, and individuals seeking to enhance their tech skills in a clean, calm, and classy environment.',
  },
  {
    id: 6,
    question: '6What is Agrovest?',
    answer: '6Techtan is a premier tech hub designed to provide tailored tech training programs for grownups, working-class professionals, and individuals seeking to enhance their tech skills in a clean, calm, and classy environment.',
  },
  {
    id: 7,
    question: '7What is Agrovest?',
    answer: '7Techtan is a premier tech hub designed to provide tailored tech training programs for grownups, working-class professionals, and individuals seeking to enhance their tech skills in a clean, calm, and classy environment.',
  },
];

const Help = () => {
  // Initialize state to track the visibility of answers for each FAQ item
  const [open, setOpen] = useState(Array(Faq.length).fill(false));

  const toggleAnswer = (index) => {
    setOpen(open.map((item, i) => (i === index ? !item : item)));
  };

  return (
    <div className='dashb'>
      <section className='dashboard'>
        <Sidebar />
        <main>
          <Header2 title='Dashboard' />
          <section className='left faq-l'>
            <div className='faqs'>
              <div className='w-r'>
                {Faq.map((item, index) => (
                  <div className="ques" key={item.id}>
                    <div>
                      {open[index] ? (
                        <IoIosArrowDropup className='arr-icon' onClick={() => toggleAnswer(index)} />
                      ) : (
                        <IoIosArrowDropdown className='arr-icon' onClick={() => toggleAnswer(index)} />
                      )}
                    </div>
                    <div>
                      <h4>{item.question}</h4>
                      {open[index] && <p>{item.answer}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
};

export default Help;
