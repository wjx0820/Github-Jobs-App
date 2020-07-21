import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { BsTriangleFill } from 'react-icons/bs'

export default function ScrollTopArrow() {
	const [showScroll, setShowScroll] = useState(false)

	function checkScrollTop() {
		if (!showScroll && window.pageYOffset > 1000) {
			setShowScroll(true)
		} else if (showScroll && window.pageYOffset <= 1000) {
			setShowScroll(false)
		}
	}

	function scrollTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	window.addEventListener('scroll', checkScrollTop)

	return (
		<Button
			style={{
				position: 'fixed',
				bottom: 50,
				right: 15,
				height: 40,
				display: showScroll ? 'flex' : 'none',
			}}
			onClick={scrollTop}
		>
			<BsTriangleFill className="mt-1" />
		</Button>
	)
}
