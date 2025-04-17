import Link from "next/link";
import React from "react";
import { FadeLoader } from "react-spinners";

function CardList({ cards, handleCardSelection, selectedCard, authuser }) {
  return (
    <div className="w-full md:w-1/4 md:border-r-[1px] md:pr-5 pb-[50px] flex flex-col justify-between">
      <div className="flex flex-wrap flex-col justify-between pb-[20px] relative h-[90%] overflow-y-auto overflow-x-clip scrollbar-hide">
        <div className="space-y-3 mb-5 md:mb-0">
          <label className="block text-sm/6 text-gray-700 font-bold text-center md:text-left">
            My Cards
          </label>
          {cards?.length > 0 ? (
            cards.map((card, index) => (
              <div key={card.id} className="w-full mb-2">
                <label
                  className={`block w-full mx-auto md:ml-3 text-center md:text-left ${
                    selectedCard === card.id ? "font-bold text-[#6d3078]" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="card"
                    value={card.id}
                    checked={selectedCard === card.id}
                    onChange={() => handleCardSelection(card.id)}
                    className="mr-2 accent-[#6d3078]"
                  />
                  Card {index + 1}
                </label>

                {selectedCard === card.id && (
                  <div className="relative w-full show">
                    <div className="mx-auto md:ml-1 card-bg bg-cover w-[250px] h-[165px] xl:w-[250px] xl:h-[165px] lg:w-[210px] lg:h-[140px] md:w-[160px] md:h-[110px] rounded-[25px] text-white flex flex-col justify-evenly">
                      <div className="px-5 py-2">
                        <p>Credit Card</p>
                      </div>
                      <div className="px-5 py-2">
                        <p className="tracking-[2px] md:tracking-[0.8px] lg:translate-[2px] md:text-[12px] lg:text-[16px]">
                          {card.cardNumber}
                        </p>
                      </div>
                    </div>

                    {authuser === "CH USER" && (
                      <div className="flex flex-row gap-3 md:text-[12px] lg:text-[16px] mt-2 mb-5">
                        <Link className="flex w-full" href="/change-pin">
                          <button className="w-full mx-auto bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
                            Change Pin
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-screen">
              <FadeLoader color="#9a48a9" />
            </div>
          )}
        </div>
      </div>

      {authuser === "CH USER" && (
        <div className="flex flex-row gap-3 md:text-[12px] lg:text-[18px]">
          <Link className="flex w-full" href="/edit-profile">
            <button className="w-full mx-auto bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
              Edit Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CardList;
