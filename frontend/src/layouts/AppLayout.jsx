/*
- AppLayout: Make it a flex box in the columns direction and give it a height
  of 100vh. Min width is here so that you simply can't shrink the screen too much,
  it's not relevant to this sticky header, sidebar, and scrollable main solution.

- main wrapping outlet: Where our sidebar and scrolling content is Make it a flexbox as well, but 
  do 'flex-1' so it takes over the rest of the space in the flex-container ("app-layout").
  Now make this outside thing overflow hidden. This is how that 'main' can't 
  overflow and break our rule of height: 100vh in our AppLayout. We want scrolling
  to be contained within the main, rather than affect our AppLayout.

  - NOTE: 
  1. Since the main wrapping the outlet becomes a flex-box, to make sure the page 'Outlet' has 
    the entirety of the page, you must do 'flex: 1' on the component the outlet is rendering
    so that the 'outlet' gets the entire space of the page. So if you're rendering
    the 'BrowsePage', then the root div of the browse page needs that flex: 1. 

  2. If you want to have a sidebar and scroll with it, put overflow-y-scroll in one of your
    inner 'mains', like how it's done in the BrowsePage. Else if your page has 
    another layout in mind, then put 'overflow-y-scroll' in your outer div 
    component that wraps around your page or layout component. The 
    latter would allow your entire page to scroll with you, except for the header.
    In both cases the header always stays at the top of the page, acting like 
    a sticky or fixed.



- header: Positioned 'static' like normal. No position sticky, absolute, nothing.
- Inside BrowsePage:

1. Set our sidebar. Should just be a static and regular sidebar. Same position
  as our header, it's normal.

2. Scrollable main: Set padding, but mainly overflow-y: auto. Now it should be good.
  As a result you have a header and sidebar that sticks with you when scrolling because 
  the scrolling is done in our 'scrollable main'. The 'main' here is hidden so it 
  always stays the same size, but the content inside of it, because we made an element 
  on the inside scrollable, then that doesn't affect us.


    
    */

import { Outlet } from "react-router-dom";
import Header from "../components/Header";
export default function AppLayout() {
	return (
		<div className="tw-min-w-72 tw-flex tw-flex-col tw-h-screen">
			{/* Navbar */}
			<Header />

			<main className="tw-flex tw-flex-1 tw-overflow-hidden">
				<Outlet />
			</main>
		</div>
	);
}
