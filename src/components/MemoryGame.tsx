/* eslint-disable react-hooks/set-state-in-effect */
import * as lodash from 'lodash';
import { useEffect, useState } from 'react';

type GameCard = {
	id: string;
	image: string;
	isFlipped: boolean;
	isMatched: boolean;
};

export const MemoryGame = ({ images }: { images: string[] }) => {
	const [gameCards, setGameCards] = useState<GameCard[]>([]);
	const [selectedCards, setSelectedCards] = useState<string[]>([]);
	const [isChecking, setIsChecking] = useState(false);

	useEffect(() => {
		if (!images?.length) return;

		const shuffled = lodash.shuffle([...images, ...images]).map((image: string) => ({
			id: `${image}-${Math.random()}`,
			image,
			isFlipped: false,
			isMatched: false,
		}));

		setGameCards(shuffled);
	}, [images]);

	const handleFlip = (id: string) => {
		if (isChecking) return;

		setGameCards(prev =>
			prev.map(card => {
				if (card.id === id && !card.isFlipped && !card.isMatched && selectedCards.length < 2) {
					return { ...card, isFlipped: true };
				}
				return card;
			}),
		);

		setSelectedCards(prev => {
			if (prev.length >= 2 || prev.includes(id)) return prev;
			return [...prev, id];
		});
	};

	useEffect(() => {
		if (selectedCards.length !== 2) return;

		const [firstId, secondId] = selectedCards;

		const firstCard = gameCards.find(c => c.id === firstId);
		const secondCard = gameCards.find(c => c.id === secondId);

		if (!firstCard || !secondCard) return;

		setIsChecking(true);

		if (firstCard.image === secondCard.image) {
			setGameCards(prev =>
				prev.map(card => {
					if (card.id === firstId || card.id === secondId) {
						return { ...card, isMatched: true };
					}
					return card;
				}),
			);

			setSelectedCards([]);
			setIsChecking(false);
		} else {
			setTimeout(() => {
				setGameCards(prev =>
					prev.map(card => {
						if (card.id === firstId || card.id === secondId) {
							return { ...card, isFlipped: false };
						}
						return card;
					}),
				);

				setSelectedCards([]);
				setIsChecking(false);
			}, 1000);
		}
	}, [selectedCards, gameCards]);

	const isGameFinished = gameCards.length > 0 && gameCards.every(card => card.isMatched);

	return (
		<div className='flex flex-col items-center gap-4'>
			<section className='border p-5 grid grid-cols-6 gap-4'>
				{gameCards.map(card => (
					<button
						type='button'
						key={card.id}
						className='cursor-pointer w-25 h-25 bg-cover bg-center bg-gray-300'
						style={card.isFlipped || card.isMatched ? { backgroundImage: `url(${card.image})` } : {}}
						onClick={() => handleFlip(card.id)}
					/>
				))}
			</section>

			{isGameFinished && <p className='text-xl font-bold text-green-600'>You won the game!</p>}
		</div>
	);
};
