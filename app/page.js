'use client';

import { useEffect, useRef } from 'react';

export default function Page() {
  const containerRef = useRef(null);

  useEffect(() => {
    const scripts = [
      "/js/jquery.min.js",
      "/js/popper.min.js",
      "/js/bootstrap.min.js",
      "/js/jquery.waypoints.min.js",
      "/js/jquery.appear.js",
      "/js/numinate.min.js",
      "/js/swiper.min.js",
      "/js/jquery.magnific-popup.min.js",
      "/js/circle-progress.js",
      "/js/jquery.countdown.min.js",
      "/js/aos.js",
      "/js/gsap.js",
      "/js/ScrollTrigger.js",
      "/js/SplitText.js",
      "/js/theia-sticky-sidebar.js",
      "/js/gsap-animation.js",
      "/js/scripts.js"
    ];

    const loadScriptsSequence = async () => {
      for (const src of scripts) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = resolve;
          script.onerror = resolve; // Continue on error
          document.body.appendChild(script);
        });
      }
    };
    
    if (!window.__SCRIPTS_LOADED) {
      window.__SCRIPTS_LOADED = true;
      loadScriptsSequence();
    }

    return () => {
       window.__SCRIPTS_LOADED = false;
       scripts.forEach(src => {
        const scriptUrls = document.querySelectorAll(`script[src="${src}"]`);
        scriptUrls.forEach(s => s.remove());
      });
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/css/fontawesome.css" />
      <link rel="stylesheet" href="/css/flaticon.css" />
      <link rel="stylesheet" href="/css/pbminfotech-base-icons.css" />
      <link rel="stylesheet" href="/css/themify-icons.css" />
      <link rel="stylesheet" href="/css/swiper.min.css" />
      <link rel="stylesheet" href="/css/magnific-popup.css" />
      <link rel="stylesheet" href="/css/aos.css" />
      <link rel="stylesheet" href="/css/shortcode.css" />
      <link rel="stylesheet" href="/css/base.css" />
      <link rel="stylesheet" href="/css/style.css" />
      <link rel="stylesheet" href="/css/responsive.css" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      <div 
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: `

	<!-- page wrapper -->
	<div class="page-wrapper" id="page">

        <!-- Header Main Area -->
        <header class="site-header header-style-1">
    			<div class="pbmit-header-overlay">
    				<div class="pbmit-main-header-area">
    					<div class="container-fluid">
    						<div class="pbmit-header-content d-flex justify-content-between align-items-center">
    							<div class="pbmit-logo-menuarea d-flex justify-content-between align-items-center">
    								<div class="site-branding">
    									<h1 class="site-title">
    										<a href="/">
    											<img class="logo-img" src="images/logo-white.png" alt="Shipex">
    										</a>
    									</h1>
    								</div>
    								<div class="site-navigation">
    									<nav class="main-menu navbar-expand-xl navbar-light">
    										<div class="navbar-header">
    											<!-- Toggle Button -->
    											<button class="navbar-toggler" type="button">
    												<i class="pbmit-base-icon-menu-1"></i>
    											</button>
    										</div>
    										<div class="pbmit-mobile-menu-bg"></div>
    										<div class="collapse navbar-collapse clearfix show" id="pbmit-menu">
    											<div class="pbmit-menu-wrap">
    												<span class="closepanel">
    													<svg class="qodef-svg--close qodef-m" xmlns="http://www.w3.org/2000/svg" width="20.163" height="20.163" viewBox="0 0 26.163 26.163">
    														<rect width="36" height="1" transform="translate(0.707) rotate(45)"></rect>
    														<rect width="36" height="1" transform="translate(0 25.456) rotate(-45)"></rect>
    													</svg>
    												</span>
                            <ul class="navigation clearfix">
                              <li><a href="/">Home</a></li>
                              <li><a href="/services">Services</a></li>
                              <li><a href="/about-us">About Us</a></li>
                              <li><a href="/contact-us">Contact Us</a></li>
                            </ul>
    											</div>
    										</div>
    									</nav>
    								</div>
    							</div>
    							<div class="pbmit-right-box d-flex align-items-center">
    								<div class="social-links-wrapper">
    									<ul class="pbmit-social-links">
    										<li class="pbmit-social-li pbmit-social-facebook">
    											<a title="Facebook" href="#" target="_blank">
    											<span><i class="pbmit-base-icon-facebook-f"></i></span>
    											</a>
    										</li>
    										<li class="pbmit-social-li pbmit-social-twitter">
    											<a title="Twitter" href="#" target="_blank">
    											<span><i class="pbmit-base-icon-twitter-2"></i></span>
    											</a>
    										</li>
    										<li class="pbmit-social-li pbmit-social-linkedin">
    											<a title="LinkedIn" href="#" target="_blank">
    											<span><i class="pbmit-base-icon-linkedin-in"></i></span>
    											</a>
    										</li>
    										<li class="pbmit-social-li pbmit-social-instagram">
    											<a title="Instagram" href="#" target="_blank">
    											<span><i class="pbmit-base-icon-instagram"></i></span>
    											</a>
    										</li>
    									</ul>
    								</div>
    								<div class="pbmit-header-button2">
    									<a class="pbmit-btn pbmit-btn-white" href="/track">
    										<span class="pbmit-button-content-wrapper">
    											<span class="pbmit-button-text">Track your parcel</span>
    										</span>
    									</a>
    								</div>
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>
    			<div class="pbmit-slider-area pbmit-slider-one">
    				<div class="swiper-slider" data-autoplay="true" data-loop="true" data-dots="true" data-arrows="false" data-columns="1" data-margin="0" data-effect="fade">
    					<div class="swiper-wrapper">

                <!-- Slide1 -->
                <div class="swiper-slide">
                  <div class="pbmit-slider-item">
                    <div class="pbmit-slider-bg" style="background-image: url(images/banner-slider-img/slide-img01.jpg);"></div>
                    <div class="container">
                      <div class="pbmit-slider-content">
                        <div class="row align-items-end">
                          <div class="col-md-12 col-lg-8 g-0">
                            <h5 class="pbmit-sub-title transform-right transform-delay-1"><span>Logistic Transportation</span></h5>
                            <h2 class="pbmit-title transform-left-1 transform-delay-2"><span>Airplane Logistics: <br> Soaring to New Heights</span></h2>
                          </div>
                          <div class="col-md-12 col-lg-4">
                            <div class="pbmit-slider-right-content">
                              <div class="pbmit-desc transform-center transform-delay-3">
                                Streamlining your logistics with transportation <br> solutions timely deliveries and exceptional service <br> worldwide.
                              </div>
                              <div class="pbmit-button transform-bottom transform-delay-4">
                                <a class="pbmit-btn" href="/services">
                                  <span class="pbmit-button-content-wrapper">
                                    <span class="pbmit-button-text">our services</span>
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

    						<!-- Slide3 -->
    						<div class="swiper-slide">
    							<div class="pbmit-slider-item">
    								<div class="pbmit-slider-bg" style="background-image: url(images/banner-slider-img/slide-img02.jpg);"></div>
    								<div class="container">
    									<div class="pbmit-slider-content">
    										<div class="row align-items-end">
    											<div class="col-md-12 col-lg-8">
    												<h5 class="pbmit-sub-title transform-right transform-delay-1"><span>Logistic Transportation</span></h5>
    												<h2 class="pbmit-title transform-left-1 transform-delay-2"><span>Logistics Excellence: <br> Beyond Boundaries</span></h2>
    											</div>
    											<div class="col-md-12 col-lg-4">
    												<div class="pbmit-slider-right-content">
    													<div class="pbmit-desc transform-center transform-delay-3">
    														Streamlining your logistics with transportation <br> solutions timely deliveries and exceptional service <br> worldwide.
    													</div>
    													<div class="pbmit-button transform-bottom transform-delay-4">
    														<a class="pbmit-btn" href="/services">
    															<span class="pbmit-button-content-wrapper">
    																<span class="pbmit-button-text">our services</span>
    															</span>
    														</a>
    													</div>
    												</div>
    											</div>
    										</div>
    									</div>
    								</div>
    							</div>
    						</div>

                <!-- Slide2 -->
                <div class="swiper-slide">
                  <div class="pbmit-slider-item">
                    <div class="pbmit-slider-bg" style="background-image: url(images/banner-slider-img/slide-img03.jpg);"></div>
                    <div class="container">
                      <div class="pbmit-slider-content">
                        <div class="row align-items-end g-0">
                          <div class="col-md-12 col-lg-8">
                            <h5 class="pbmit-sub-title transform-right transform-delay-1"><span>Logistic Transportation</span></h5>
                            <h2 class="pbmit-title transform-left-1 transform-delay-2"><span>Heavy Truck Logistics: <br> Maximizing Capacity</span></h2>
                          </div>
                          <div class="col-md-12 col-lg-4">
                            <div class="pbmit-slider-right-content">
                              <div class="pbmit-desc transform-center transform-delay-3">
                                Streamlining your logistics with transportation <br> solutions timely deliveries and exceptional service <br> worldwide.
                              </div>
                              <div class="pbmit-button transform-bottom transform-delay-4">
                                <a class="pbmit-btn" href="/services">
                                  <span class="pbmit-button-content-wrapper">
                                    <span class="pbmit-button-text">our services</span>
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    					</div>
    				</div>
    			</div>
    		</header>
        <!-- Header Main Area End Here -->

        <!-- Page Content -->
        <div class="page-content">

			<!-- Award Box Start -->
            <section class="award-section-two pbmit-bg-color-white animated fadeIn animated-fast pbmit-element-award-box-style-1">
				<div class="container-fluid">
					<div class="row g-0">
						<div class="col-md-12 col-xl-9 pbmit-left-col">
							<div class="swiper-slider" data-autoplay="false" data-loop="true" data-dots="false" data-arrows="false" data-columns="3" data-margin="30" data-effect="slide">
								<div class="swiper-wrapper">
									<!-- Slide1 -->
									<article class="pbmit-award-box-style-1 swiper-slide">
										<div class="pbmit-awardbox-wrapper">
											<div class= "pbmit-img-box">
												<img src="images/homepage-2/award-box/img-01.jpg" alt="Road Freight">
												<h4 class="pbmit-freight-box-title">Road Freight</h4>
											</div>
											<div class="pbmit-shape-wraper">
												<div class="pbmit-shape-wraper-inner">
													<div class="pbmit-award-btn">
														<a class="pbmit-button-inner" href="/services">
															<span class="pbmit-button-icon">View Detail</span>
														</a>
													</div>
												</div>
											</div>
										</div>
									</article>
									<!-- Slide2 -->
									<article class="pbmit-award-box-style-1 swiper-slide">
										<div class="pbmit-awardbox-wrapper">
											<div class= "pbmit-img-box">
												<img src="images/homepage-2/award-box/img-02.jpg" alt="Air Freight">
												<h4 class="pbmit-freight-box-title">Air Freight</h4>
											</div>
											<div class="pbmit-shape-wraper">
												<div class="pbmit-shape-wraper-inner">
													<div class="pbmit-award-btn">
														<a class="pbmit-button-inner" href="/services">
															<span class="pbmit-button-icon">View Detail</span>
														</a>
													</div>
												</div>
											</div>
										</div>
									</article>
									<!-- Slide3 -->
									<article class="pbmit-award-box-style-1 swiper-slide">
										<div class="pbmit-awardbox-wrapper">
											<div class= "pbmit-img-box">
												<img src="images/homepage-2/award-box/img-03.jpg" alt="Ship Freight">
												<h4 class="pbmit-freight-box-title">Ship Freight</h4>
											</div>
											<div class="pbmit-shape-wraper">
												<div class="pbmit-shape-wraper-inner">
													<div class="pbmit-award-btn">
														<a class="pbmit-button-inner" href="/services">
															<span class="pbmit-button-icon">View Detail</span>
														</a>
													</div>
												</div>
											</div>
										</div>
									</article>
									<!-- Slide4 -->
									<article class="pbmit-award-box-style-1 swiper-slide">
										<div class="pbmit-awardbox-wrapper">
											<div class= "pbmit-img-box">
												<img src="images/homepage-2/award-box/img-04.jpg" alt="Ocean Freight">
												<h4 class="pbmit-freight-box-title">Ocean Freight</h4>
											</div>
											<div class="pbmit-shape-wraper">
												<div class="pbmit-shape-wraper-inner">
													<div class="pbmit-award-btn">
														<a class="pbmit-button-inner" href="/services">
															<span class="pbmit-button-icon">View Detail</span>
														</a>
													</div>
												</div>
											</div>
										</div>
									</article>
								</div>
							</div>
						</div>
						<div class="col-md-12 col-xl-3 pbmit-right-col">
							<div class="pbmit-award-wraper">
								<div class="pbmit-award-image-title">
									<div class="pbmit-award-image">
										<img src="images/homepage-2/1st-award.png" alt="#1 &nbspCertified Award Ocean Logistic Services in USA" class="img-fluid">
									</div>
									<div class="pbmit-award-heading">
										<h4 class="pbmit-award-title">#1 &nbspCertified Award Ocean Logistic Services in USA</h4>
									</div>
								</div>
								<div class="pbmit-award-box-desc">We have got awards thanks to our amazing clients.</div>
							</div>
						</div>
					</div>
				</div>
            </section>
            <!-- Award Box End -->

			<!-- Service Start -->
            <section class="service-two-bg">
				<div class="container">
					<div class="swiper-slider pb-0" data-autoplay="false" data-loop="true" data-dots="true" data-arrows="false" data-columns="4" data-margin="30" data-effect="slide">
						<div class="pbmit-heading-subheading">
							<h4 class="pbmit-subtitle">Our experience</h4>
							<h2 class="pbmit-title">Logistics Solutions <br> to Help Business</h2>
						</div>
						<div class="swiper-wrapper pt-4">
							<!-- Slide1 -->
							<article class="pbmit-service-style-2 swiper-slide">
								<div class="pbminfotech-post-item">
									<div class="pbminfotech-box-content">
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title">
											<a href="/services">Warehouse Storage</a>
										</h3>
										<div class="pbmit-service-description">
											<p>Secure and organized storage solutions for efficient inventory management.</p>
										</div>
										<div class="pbmit-service-icon">
											<svg enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g id="_x30_6_x2C__Delivery_x2C__domestic_ems_x2C__express_x2C__global_x2C__logistics"><g id="XMLID_129_"><path id="XMLID_139_" d="m97.239 406.218c31.077 40.974 78.875 68.6 133.144 72.611-18.323-19.421-33.738-44.255-44.965-72.611z"></path><path id="XMLID_189_" d="m196.314 406.218c11.981 29.004 28.578 54.262 48.735 73.109.296-.002.59-.008.886-.011 20.152-18.846 36.745-44.099 48.723-73.098z"></path><path id="XMLID_190_" d="m164.905 300.114h-104.971c.949 35.414 11.948 68.362 30.233 96.104h91.536c-10.541-30.006-16.306-62.928-16.798-96.104z"></path><path id="XMLID_191_" d="m230.427 111.395c-54.286 3.999-102.1 31.627-133.186 72.611h88.474c11.099-28.048 26.279-52.973 44.712-72.611z"></path><path id="XMLID_192_" d="m274.606 113.628c-4.076-.588-8.519-1.148-12.911-1.608 4.773 5.147 9.33 10.646 13.644 16.485-.659-5.137-.874-10.029-.733-14.877z"></path><path id="XMLID_193_" d="m294.806 184.006c-11.874-29.064-28.313-54.311-48.273-73.08-.505-.013-.994-.022-1.475-.027-20.087 18.87-36.643 44.119-48.615 73.108h98.363z"></path><path id="XMLID_194_" d="m192.565 194.006c-10.833 29.551-17.052 62.452-17.652 96.107h141.146c-.59-33.713-6.725-66.608-17.415-96.107z"></path><path id="XMLID_195_" d="m192.431 396.218h106.11c10.826-29.55 17.004-62.455 17.526-96.104h-141.161c.521 33.649 6.699 66.555 17.525 96.104z"></path><path id="XMLID_196_" d="m181.977 194.006h-91.809c-18.286 27.743-29.286 60.692-30.235 96.107h104.981c.581-33.506 6.578-66.339 17.063-96.107z"></path><path id="XMLID_199_" d="m368.279 32.673c-46.162 0-83.717 37.554-83.717 83.713 0 56.623 50.137 70.383 82.944 131.892 16.825-39.657 65.856-74.841 75.682-94.472 27.532-54.996-12.18-121.133-74.909-121.133zm.002 131.694c-26.996 0-48.958-21.963-48.958-48.959s21.963-48.959 48.958-48.959c26.997 0 48.959 21.963 48.959 48.959s-21.963 48.959-48.959 48.959z"></path><path id="XMLID_200_" d="m368.281 76.449c-21.482 0-38.958 17.477-38.958 38.959s17.477 38.959 38.958 38.959c21.482 0 38.959-17.477 38.959-38.959s-17.477-38.959-38.959-38.959z"></path><path id="XMLID_201_" d="m428.207 290.114c-1.122-28.314-11.42-59.494-21.345-80.797-15.114 16.513-29.316 34.951-33.716 53.587-.502 2.126-2.327 3.681-4.507 3.838-2.172.158-4.207-1.116-5.01-3.152-10.688-27.086-37.395-54.794-56.762-76.294.1.274.182.556.233.85 11.659 31.238 18.349 66.185 18.959 101.969h102.148z"></path><path id="XMLID_202_" d="m309.27 396.218h88.743c18.284-27.743 29.284-60.69 30.233-96.104h-102.179c-.492 33.176-6.256 66.098-16.797 96.104z"></path><path id="XMLID_203_" d="m260.83 478.571c53.014-4.798 99.614-32.144 130.11-72.352h-85.386c-11.177 28.231-26.507 52.969-44.724 72.352z"></path></g></g></svg>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide2 -->
							<article class="pbmit-service-style-2 swiper-slide">
								<div class="pbminfotech-post-item">
									<div class="pbminfotech-box-content">
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title">
											<a href="/services">Real Time Tracking</a>
										</h3>
										<div class="pbmit-service-description">
											<p>Monitor your shipments in real time with accurate tracking updates.</p>
										</div>
										<div class="pbmit-service-icon">
											<svg enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g id="_x30_5_x2C__logistics_x2C__shipping_x2C__truck_x2C__delivery_x2C__checked"><g id="XMLID_175_"><path id="XMLID_176_" d="m125.132 401.481c-2.272 0-4.122 1.842-4.122 4.106 0 2.274 1.849 4.125 4.122 4.125 2.267 0 4.11-1.851 4.11-4.125 0-2.264-1.844-4.106-4.11-4.106z"></path><path id="XMLID_210_" d="m318.133 67.967h-281.076v234h281.076zm-140.539 211.515c-52.116 0-94.516-42.399-94.516-94.515s42.399-94.516 94.516-94.516 94.516 42.399 94.516 94.516c0 52.116-42.399 94.515-94.516 94.515z"></path><path id="XMLID_226_" d="m125.126 367.162c-21.193 0-38.435 17.241-38.435 38.435s17.242 38.436 38.435 38.436 38.435-17.242 38.435-38.436-17.242-38.435-38.435-38.435zm.006 52.551c-7.787 0-14.122-6.337-14.122-14.125 0-7.778 6.335-14.106 14.122-14.106 7.78 0 14.11 6.328 14.11 14.106 0 7.788-6.33 14.125-14.11 14.125z"></path><path id="XMLID_229_" d="m377.753 367.161c-21.193 0-38.436 17.242-38.436 38.436s17.242 38.437 38.436 38.437c21.193 0 38.435-17.242 38.435-38.437-.001-21.194-17.242-38.436-38.435-38.436zm.004 52.552c-7.787 0-14.122-6.337-14.122-14.125 0-7.778 6.335-14.106 14.122-14.106 7.781 0 14.111 6.328 14.111 14.106 0 7.788-6.33 14.125-14.111 14.125z"></path><path id="XMLID_230_" d="m377.757 401.481c-2.272 0-4.122 1.842-4.122 4.106 0 2.274 1.849 4.125 4.122 4.125 2.267 0 4.111-1.851 4.111-4.125 0-2.264-1.844-4.106-4.111-4.106z"></path><path id="XMLID_231_" d="m351.868 298.231v-99.965h-23.735v108.701c0 2.762-2.239 5-5 5h-286.076v62.23l16.479 16.48h25.516c6.306-19.427 24.571-33.516 46.074-33.516s39.767 14.088 46.073 33.516h160.479c6.306-19.428 24.571-33.517 46.074-33.517 25.019 0 45.667 19.069 48.177 43.436h33.025l15.989-15.116v-82.249h-118.075c-2.761 0-5-2.238-5-5z"></path><path id="XMLID_237_" d="m177.594 100.451c-46.602 0-84.516 37.914-84.516 84.516s37.914 84.515 84.516 84.515 84.516-37.914 84.516-84.515c0-46.602-37.913-84.516-84.516-84.516zm45.218 56.218-56.75 56.75c-1.954 1.953-5.118 1.952-7.071 0l-32.25-32.25c-1.953-1.953-1.953-5.119 0-7.071s5.118-1.952 7.071 0l28.714 28.714 53.214-53.214c1.953-1.952 5.118-1.952 7.071 0 1.954 1.953 1.954 5.119.001 7.071z"></path><path id="XMLID_238_" d="m361.868 198.266v94.965h113.075v-23.157l-61.272-71.808z"></path></g></g></svg>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide3 -->
							<article class="pbmit-service-style-2 swiper-slide">
								<div class="pbminfotech-post-item">
									<div class="pbminfotech-box-content">
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title">
											<a href="/services">Distribution Centers</a>
										</h3>
										<div class="pbmit-service-description">
											<p>Strategically located centers to ensure fast and efficient distribution.</p>
										</div>
										<div class="pbmit-service-icon">
											<svg enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g id="_x30_4_x2C__address_x2C__Gps_x2C__location_x2C__pin_x2C__sign"><g id="XMLID_180_"><path id="XMLID_184_" d="m391.996 174.086c0-74.988-61.007-135.995-135.996-135.995-74.987 0-135.994 61.007-135.994 135.995 0 68.159 114.342 187.283 135.994 209.224 21.652-21.945 135.996-141.085 135.996-209.224zm-209.266 0c0-40.402 32.869-73.271 73.271-73.271s73.271 32.869 73.271 73.271-32.87 73.271-73.271 73.271c-40.402 0-73.271-32.869-73.271-73.271z"></path><path id="XMLID_232_" d="m288.845 174.086c0-18.11-14.734-32.844-32.845-32.844-18.11 0-32.844 14.734-32.844 32.844 0 18.111 14.734 32.845 32.844 32.845 18.111 0 32.845-14.734 32.845-32.845z"></path><path id="XMLID_239_" d="m319.272 174.086c0-34.888-28.383-63.271-63.271-63.271s-63.271 28.383-63.271 63.271 28.383 63.271 63.271 63.271 63.271-28.383 63.271-63.271zm-106.116 0c0-23.625 19.22-42.844 42.844-42.844s42.845 19.22 42.845 42.844-19.22 42.845-42.845 42.845-42.844-19.221-42.844-42.845z"></path><path id="XMLID_240_" d="m336.429 306.875c-24.213 31.241-56.168 66.726-76.926 87.084-1.945 1.91-5.061 1.911-7.006 0-19.942-19.53-52.196-55.177-76.925-87.084h-56.343l-28.306 167.034h330.154l-28.306-167.033h-56.342z"></path></g></g></svg>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide4 -->
							<article class="pbmit-service-style-2 swiper-slide">
								<div class="pbminfotech-post-item">
									<div class="pbminfotech-box-content">
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title">
											<a href="/services">Bonded Warehousing</a>
										</h3>
										<div class="pbmit-service-description">
											<p>Safe storage for goods under customs control with full compliance.</p>
										</div>
										<div class="pbmit-service-icon">
											<svg enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g id="_x30_1_x2C__package_x2C__Box_x2C__delivery_x2C__return_x2C__shipment"><g id="XMLID_186_"><path id="XMLID_187_" d="m214.187 139.087h83.622v70.413h-83.622z"></path><path id="XMLID_206_" d="m218.666 44.516h-115.871l-53.655 84.571h155.727z"></path><path id="XMLID_256_" d="m296.997 129.087-13.799-84.571h-54.4l-13.799 84.571z"></path><path id="XMLID_257_" d="m462.86 129.087-53.655-84.571h-115.875l13.799 84.571z"></path><path id="XMLID_265_" d="m307.809 139.087v75.413c0 2.761-2.239 5-5 5h-93.622c-2.761 0-5-2.239-5-5v-75.413h-159.141v328.397h421.907v-328.397zm-224.809 303.412c0 2.762-2.239 5-5 5s-5-2.238-5-5v-82c0-2.762 2.239-5 5-5s5 2.238 5 5zm25.5 0c0 2.762-2.239 5-5 5s-5-2.238-5-5v-82c0-2.762 2.239-5 5-5s5 2.238 5 5zm248.024-84.261c0 36.44-34.906 66.087-77.812 66.087h-92.746c-2.761 0-5-2.238-5-5s2.239-5 5-5h92.746c37.392 0 67.812-25.16 67.812-56.087v-1.424c0-30.926-30.42-56.086-67.812-56.086h-76.258l52.023 34.752c2.296 1.533 2.914 4.639 1.38 6.935-1.524 2.28-4.623 2.925-6.935 1.38-.17-.113-65.842-43.983-65.734-43.911-2.587-1.741-2.971-5.396-.808-7.629.619-.639-3.654 2.299 66.543-44.594 2.296-1.534 5.401-.916 6.935 1.38s.916 5.401-1.38 6.935l-52.026 34.752h76.261c42.905 0 77.812 29.646 77.812 66.086v1.424z"></path></g></g></svg>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide5 -->
							<article class="pbmit-service-style-2 swiper-slide">
								<div class="pbminfotech-post-item">
									<div class="pbminfotech-box-content">
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title">
											<a href="/services">Last Mile Delivery</a>
										</h3>
										<div class="pbmit-service-description">
											<p>Fast and reliable final delivery directly to your customer’s door.</p>
										</div>
										<div class="pbmit-service-icon">
											<svg enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g id="_x32_2_x2C__Factory_x2C__mill_x2C__processing_x2C__site_x2C__treatment"><g id="XMLID_18_"><path id="XMLID_20_" d="m291.592 324.091h23.317v19.161h-23.317z"></path><path id="XMLID_21_" d="m330.923 384.474h69.077v81.026h-69.077z"></path><path id="XMLID_22_" d="m291.591 262.042h23.317v19.161h-23.317z"></path><path id="XMLID_306_" d="m291.593 199.994h23.317v19.161h-23.317z"></path><path id="XMLID_307_" d="m78.591 324.091h119.554v19.161h-119.554z"></path><path id="XMLID_308_" d="m173.368 72.167v-25.667h-92.702v25.667z"></path><path id="XMLID_309_" d="m150.305 82.167h-46.576l-24.948 178.683h96.472z"></path><path id="XMLID_315_" d="m78.591 388.135h119.554v19.161h-119.554z"></path><path id="XMLID_316_" d="m351.592 324.091h23.317v19.161h-23.317z"></path><path id="XMLID_319_" d="m34.208 270.85v194.65h208.923v-194.65c-21.029 0-183.824 0-208.923 0zm173.936 141.446c0 2.762-2.239 5-5 5h-129.553c-2.761 0-5-2.238-5-5v-29.161c0-2.762 2.239-5 5-5h129.554c2.761 0 5 2.238 5 5v29.161zm0-93.205v29.161c0 2.762-2.239 5-5 5h-129.553c-2.761 0-5-2.238-5-5v-29.161c0-2.762 2.239-5 5-5h129.554c2.761 0 4.999 2.238 4.999 5z"></path><path id="XMLID_321_" d="m351.591 262.042h23.317v19.161h-23.317z"></path><path id="XMLID_324_" d="m407.679 113.674v35.379c0 3.793-4.074 6.209-7.402 4.385l-72.599-39.764v35.379c0 3.791-4.071 6.211-7.402 4.385l-67.145-36.774v348.836h67.792v-86.026c0-2.762 2.239-5 5-5h79.077c2.761 0 5 2.238 5 5v86.026h67.788c.005-91.481.03-227.134-.103-313.482zm-126.088 143.368c0-2.762 2.239-5 5-5h33.317c2.761 0 5 2.238 5 5v29.161c0 2.762-2.239 5-5 5h-33.317c-2.761 0-5-2.238-5-5zm43.318 91.21c0 2.762-2.239 5-5 5h-33.317c-2.761 0-5-2.238-5-5v-29.161c0-2.762 2.239-5 5-5h33.317c2.761 0 5 2.238 5 5zm.001-124.097c0 2.761-2.239 5-5 5h-33.317c-2.761 0-5-2.239-5-5v-29.161c0-2.761 2.239-5 5-5h33.317c2.761 0 5 2.239 5 5zm16.681 32.887c0-2.762 2.239-5 5-5h33.317c2.761 0 5 2.238 5 5v29.161c0 2.762-2.239 5-5 5h-33.317c-2.761 0-5-2.238-5-5zm43.318 91.21c0 2.762-2.239 5-5 5h-33.317c-2.761 0-5-2.238-5-5v-29.161c0-2.762 2.239-5 5-5h33.317c2.761 0 5 2.238 5 5zm.001-124.097c0 2.761-2.239 5-5 5h-33.317c-2.761 0-5-2.239-5-5v-29.161c0-2.761 2.239-5 5-5h33.317c2.761 0 5 2.239 5 5zm22.095 32.887c0-2.762 2.239-5 5-5h33.317c2.761 0 5 2.238 5 5v29.161c0 2.762-2.239 5-5 5h-33.317c-2.761 0-5-2.238-5-5zm43.319 91.21c0 2.762-2.239 5-5 5h-33.317c-2.761 0-5-2.238-5-5v-29.161c0-2.762 2.239-5 5-5h33.317c2.761 0 5 2.238 5 5zm.001-124.097c0 2.761-2.239 5-5 5h-33.317c-2.761 0-5-2.239-5-5v-29.161c0-2.761 2.239-5 5-5h33.317c2.761 0 5 2.239 5 5z"></path><path id="XMLID_333_" d="m417.006 324.091h23.317v19.161h-23.317z"></path><path id="XMLID_334_" d="m417.005 262.042h23.317v19.161h-23.317z"></path><path id="XMLID_335_" d="m417.007 199.994h23.317v19.161h-23.317z"></path><path id="XMLID_339_" d="m351.593 199.994h23.317v19.161h-23.317z"></path></g></g></svg>
										</div>
									</div>
								</div>
							</article>
						</div>
					</div>
				</div>
            </section>
            <!-- Service End -->

			<!-- About Start -->
			<section class="about-section-two">
				<div class="container-fluid">
					<div class="row g-0">
						<div class="col-md-12 col-xl-6">
							<div class="about-two-left-bg"></div>
						</div>
						<div class="col-md-12 col-xl-6">
							<div class="about-two-right-box pbmit-bg-color-white">
								<div class="pbmit-heading-subheading">
									<h4 class="pbmit-subtitle">Our experience</h4>
									<h2 class="pbmit-title">Maximizing efficiency in delivery services</h2>
									<div class="pbmit-heading-desc">
										Titan X Logistics is a company specialized in managing the transportation, storage, and distribution of goods. We offer services such as freight forwarding, warehousing, inventory manage supply chain transportation logistic solutions.
									</div>
								</div>
								<div class="row">
									<div class="col-md-6 mb-xl-0 mb-3">
										<div class="pbminfotech-ele-fid-style-1">
											<div class="pbmit-fld-contents d-flex align-items-center">
												<div class="pbmit-circle-outer" data-digit="85" data-fill="#00358d" data-emptyfill="" data-before="" data-before-type="sup" data-after="<span>%</span>" data-after-type="span" data-thickness="2" data-size="127">
													<div class="pbmit-circle">
														<div class="pbmit-fid-inner">
															<span class="pbmit-fid-before"></span>
															<span class="pbmit-number-rotate numinate" data-appear-animation="animateDigits" data-from="0" data-to="85" data-interval="1" data-before="" data-before-style="" data-after="" data-after-style="">85</span>
															<span class="pbmit-fid"><span>%</span></span>
														</div>
													</div>
												</div>
												<div class="pbmit-fid-sub">
													<h3 class="pbmit-fid-title">Quality Control<br>System</h3>
												</div>
											</div>
										</div>
									</div>
									<div class="col-md-6">
										<div class="pbminfotech-ele-fid-style-1">
											<div class="pbmit-fld-contents d-flex align-items-center">
												<div class="pbmit-circle-outer" data-digit="85" data-fill="#00358d" data-emptyfill="" data-before="" data-before-type="sup" data-after="<span>%</span>" data-after-type="span" data-thickness="2" data-size="127">
													<div class="pbmit-circle">
														<div class="pbmit-fid-inner">
															<span class="pbmit-fid-before"></span>
															<span class="pbmit-number-rotate numinate" data-appear-animation="animateDigits" data-from="0" data-to="93" data-interval="1" data-before="" data-before-style="" data-after="" data-after-style="">93</span>
															<span class="pbmit-fid"><span>%</span></span>
														</div>
													</div>
												</div>
												<div class="pbmit-fid-sub">
													<h3 class="pbmit-fid-title">Highly Professionall<br>Staff</h3>
												</div>
											</div>
										</div>
									</div>
								</div>
								<ul class="list-group style-2 pt-5 mb-4">
									<li class="list-group-item">
										<span class="pbmit-icon-list-icon">
											<i class="pbmit-shipex-icon pbmit-shipex-icon-tick"></i>
										</span>
										<span class="pbmit-icon-list-text">With over four decades of experience providing solutions</span>
									</li>
									<li class="list-group-item">
										<span class="pbmit-icon-list-icon">
											<i class="pbmit-shipex-icon pbmit-shipex-icon-tick"></i>
										</span>
										<span class="pbmit-icon-list-text">See projects through and proactively develop solutions</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- About End -->

			<!-- Client Start -->
			<section class="client-section-two">
				<div class="container-fluid">
					<div class="swiper-slider" data-autoplay="true" data-loop="true" data-dots="false" data-arrows="false" data-columns="6" data-margin="30" data-effect="slide">
						<div class="swiper-wrapper">
							<!-- Slide1 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-01.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-01.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide2 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-02.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-02.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide3 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-03.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-03.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide4 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-04.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-04.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide5 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-05.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-05.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide6 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-06.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-06.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide7 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-07.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-07.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide8 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-08.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-08.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
							<!-- Slide9 -->
							<article class="pbmit-client-style-1 swiper-slide">
								<div class="pbmit-border-wrapper">
									<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
										<h4 class="pbmit-hide">Client-01</h4>
										<div class="pbmit-client-hover-img">
											<img src="images/client/client-global-09.png" alt="">
										</div>
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/client/client-dark-09.png" class="img-fluid" alt="">
											</div>
										</div>
									</div>
								</div>
							</article>
						</div>
					</div>
				</div>
			</section>
			<!-- Client end -->


			<!-- Testimonial Start -->
			<section>
				<div class="container">
					<div class="testimonial-one">
						<div class="row g-0">
							<div class="col-md-12 col-xl-3">
								<div class="pbmit-spinner-box-style-1">
									<div class="pbmit-ihbox-box">
										<div class="pbmit-ihbox-icon">
											<div class="pbmit-ihbox-icon-wrapper pbmit-icon-type-icon">
												<svg id="Layer_1" enable-background="new 0 0 100 100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
													<path d="m54.75 61.7309799v-2.3699951c0-21.9786606 16.2715454-39.8894348 37.5211639-42.4388428 2.7931672-.3351097 5.2288361 1.917471 5.2288361 4.7306748v.0000095c0 2.4273148-1.8343735 4.4202805-4.2426605 4.7236137-7.4862671.9429264-14.1913986 4.3405972-19.203804 9.2676563-1.7802734 1.7499619-.5009689 4.7270927 1.9953613 4.7170334.0236969-.0000954.0474014-.000145.0710983-.000145 12.2492294 0 21.9682159 10.0996895 21.3522568 22.4834023-.538559 10.8274422-9.4114075 19.7002907-20.2388535 20.2388496-12.3837051.6159593-22.4833984-9.1030272-22.4833984-21.3522567z"></path>
													<path d="m2.5000021 61.2574081.000001-1.8964233c0-21.9786606 16.2715454-39.8894348 37.5211601-42.4388428 2.7931755-.3351097 5.2288368 1.917471 5.2288368 4.7306748v.0003147c0 2.4272079-1.8342209 4.4199734-4.2423592 4.7236252-7.481739.9434032-14.1888084 4.3410473-19.1987572 9.2678051-1.779623 1.7500687-.500473 4.7271957 1.9954643 4.7165833.025219-.0001068.0504398-.0001602.0756588-.0001602 11.8699932 0 21.3699932 9.5 21.3699932 21.3699951 0 12.0883865-9.8361855 21.7125397-21.996748 21.3711853-11.6399678-.3267442-20.7532557-10.200203-20.7532498-21.8447572z"></path>
												</svg>
											</div>
										</div>
										<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 200 200">
											<defs>
												<path d="M0, 100a100, 100 0 1, 0 200, 0a100, 100 0 1, 0 -200, 0" id="txt-path"></path>
											</defs>
											<circle cx="160" cy="100" r="80" fill="none"></circle>
											<text>
												<textPath startOffset="0" xlink:href="#txt-path">Testimonial - trusted by clients  -</textPath>
											</text>
										</svg>
									</div>
								</div>
							</div>
							<div class="col-md-12 col-xl-9">
								<div class="swiper-slider ms-3" data-autoplay="true" data-loop="true" data-dots="true" data-arrows="false" data-columns="1" data-margin="0" data-effect="slide">
									<div class="swiper-wrapper">
										<!-- Slide1 -->
										<article class="pbmit-testimonial-style-1 swiper-slide">
											<div class="pbminfotech-post-item">
												<div class="pbmit-box-content-wrap">
													<div class="pbminfotech-box-star-ratings">
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
													</div>
													<div class="pbminfotech-box-desc">
														<blockquote class="pbminfotech-testimonial-text">
															<p>“Outstanding service and reliable delivery every time. Titan X Logistics has truly simplified our shipping operations and improved our customer satisfaction.”</p>
														</blockquote>
													</div>
													<div class="pbminfotech-box-author d-flex align-items-center">
														<div class="pbminfotech-box-img">
															<div class="pbmit-featured-img-wrapper">
																<div class="pbmit-featured-wrapper">
																	<img src="images/homepage-2/reviewer/reviewer-01.jpg" class="" alt="reviewer-01">
																</div>
															</div>
														</div>
														<div class="pbmit-auther-content">
															<h3 class="pbminfotech-box-title">Michael Green</h3>
															<div class="pbminfotech-testimonial-detail">Fast Delivery</div>
														</div>
													</div>
												</div>
											</div>
										</article>
										<!-- Slide2 -->
										<article class="pbmit-testimonial-style-1 swiper-slide">
											<div class="pbminfotech-post-item">
												<div class="pbmit-box-content-wrap">
													<div class="pbminfotech-box-star-ratings">
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
													</div>
													<div class="pbminfotech-box-desc">
														<blockquote class="pbminfotech-testimonial-text">
															<p>“Professional, efficient, and always on schedule. Their team ensures every shipment arrives safely without delays or complications.”</p>
														</blockquote>
													</div>
													<div class="pbminfotech-box-author d-flex align-items-center">
														<div class="pbminfotech-box-img">
															<div class="pbmit-featured-img-wrapper">
																<div class="pbmit-featured-wrapper">
																	<img src="images/homepage-2/reviewer/reviewer-02.jpg" class="" alt="reviewer-02">
																</div>
															</div>
														</div>
														<div class="pbmit-auther-content">
															<h3 class="pbminfotech-box-title">Hazel Jenkins</h3>
															<div class="pbminfotech-testimonial-detail">Reliable service</div>
														</div>
													</div>
												</div>
											</div>
										</article>
										<!-- Slide3 -->
										<article class="pbmit-testimonial-style-1 swiper-slide">
											<div class="pbminfotech-post-item">
												<div class="pbmit-box-content-wrap">
													<div class="pbminfotech-box-star-ratings">
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
													</div>
													<div class="pbminfotech-box-desc">
														<blockquote class="pbminfotech-testimonial-text">
															<p>“Great communication and real-time updates make a huge difference. We always know where our shipments are and when they’ll arrive.”</p>
														</blockquote>
													</div>
													<div class="pbminfotech-box-author d-flex align-items-center">
														<div class="pbminfotech-box-img">
															<div class="pbmit-featured-img-wrapper">
																<div class="pbmit-featured-wrapper">
																	<img src="images/homepage-2/reviewer/reviewer-03.jpg" class="" alt="reviewer-03">
																</div>
															</div>
														</div>
														<div class="pbmit-auther-content">
															<h3 class="pbminfotech-box-title">Parsons William</h3>
															<div class="pbminfotech-testimonial-detail">Highly Recommend</div>
														</div>
													</div>
												</div>
											</div>
										</article>
										<!-- Slide4 -->
										<article class="pbmit-testimonial-style-1 swiper-slide">
											<div class="pbminfotech-post-item">
												<div class="pbmit-box-content-wrap">
													<div class="pbminfotech-box-star-ratings">
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1 pbmit-active"></i>
														<i class="pbmit-base-icon-star-1"></i>
													</div>
													<div class="pbminfotech-box-desc">
														<blockquote class="pbminfotech-testimonial-text">
															<p>“Secure handling and excellent logistics support. We trust Titan X Logistics for all our warehousing and distribution needs.”</p>
														</blockquote>
													</div>
													<div class="pbminfotech-box-author d-flex align-items-center">
														<div class="pbminfotech-box-img">
															<div class="pbmit-featured-img-wrapper">
																<div class="pbmit-featured-wrapper">
																	<img src="images/homepage-2/reviewer/reviewer-04.jpg" class="" alt="reviewer-04">
																</div>
															</div>
														</div>
														<div class="pbmit-auther-content">
															<h3 class="pbminfotech-box-title">Victoria Porter</h3>
															<div class="pbminfotech-testimonial-detail">Cargo Expert</div>
														</div>
													</div>
												</div>
											</div>
										</article>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- Testimonial End -->
			</section>

			<!-- About Us Start -->
			<section class="pbmit-bg-color-blackish about-us-section-two">
				<div class="container">
					<div class="row align-items-center">
						<div class="col-md-6">
							<div class="pbmit-heading-subheading">
								<h4 class="pbmit-subtitle">Global presence</h4>
								<h2 class="pbmit-title">List of nations we <br> work with worldwide</h2>
							</div>
						</div>
						<div class="col-md-6 position-relative">
							<div class="swiper-slider" data-autoplay="false" data-arrows-class="ihbox-swiper-arrow" data-loop="true" data-dots="false" data-arrows="true" data-columns="1" data-margin="30" data-effect="slide">
								<div class="swiper-wrapper">
									<!-- Slide1 -->
									<article class="pbmit-miconheading-style-2 swiper-slide">
										<div class="pbmit-ihbox pbmit-ihbox-style-2">
											<div class="pbmit-ihbox-headingicon">
												<div class="pbmit-ihbox-icon">
													<div class="pbmit-ihbox-icon-wrapper pbmit-icon-type-icon"></div>
												</div>
												<div class="pbmit-ihbox-contents">
													<h2 class="pbmit-element-title">America</h2>
													<div class="pbmit-heading-desc">1380 Oakwood Avenue New York NY 10025</div>
												</div>
											</div>
										</div>
									</article>
									<!-- Slide2 -->
									<article class="pbmit-miconheading-style-2 swiper-slide">
										<div class="pbmit-ihbox pbmit-ihbox-style-2">
											<div class="pbmit-ihbox-headingicon">
												<div class="pbmit-ihbox-icon">
													<div class="pbmit-ihbox-icon-wrapper pbmit-icon-type-icon"></div>
												</div>
												<div class="pbmit-ihbox-contents">
													<h2 class="pbmit-element-title">America</h2>
													<div class="pbmit-heading-desc">1380 Oakwood Avenue New York NY 10025</div>
												</div>
											</div>
										</div>
									</article>
									<!-- Slide3 -->
									<article class="pbmit-miconheading-style-2 swiper-slide">
										<div class="pbmit-ihbox pbmit-ihbox-style-2">
											<div class="pbmit-ihbox-headingicon">
												<div class="pbmit-ihbox-icon">
													<div class="pbmit-ihbox-icon-wrapper pbmit-icon-type-icon"></div>
												</div>
												<div class="pbmit-ihbox-contents">
													<h2 class="pbmit-element-title">America</h2>
													<div class="pbmit-heading-desc">1380 Oakwood Avenue New York NY 10025</div>
												</div>
											</div>
										</div>
									</article>
								</div>
							</div>
							<div class="ihbox-swiper-arrow swiper-btn-custom d-inline-flex flex-row-reverse"></div>
						</div>
					</div>
					<div class="map-image">
						<img src="images/homepage-2/map-img.png" class="img-fluid" alt="">
					</div>
				</div>
			</section>
			<!-- About Us End -->

			<!-- Fid Start -->
			<section>
				<div class="container">
					<div class="fid-two-area pbmit-bg-color-global">
						<div class="row">
							<div class="col-md-12 col-xl-4">
								<div class="pbminfotech-ele-fid-style-2">
									<div class="pbmit-fld-contents">
										<div class="pbmit-fld-wrap">
											<div class="pbmit-sbox-icon-wrapper pbmit-icon-type-icon">
												<i class="pbmit-shipex-icon pbmit-shipex-icon-arrow"></i>
											</div>
											<h4 class="pbmit-fid-inner">
												<span class="pbmit-fid-before"></span>
												<span class="pbmit-number-rotate numinate" data-appear-animation="animateDigits" data-from="0" data-to="245" data-interval="25" data-before="" data-before-style="" data-after="" data-after-style="">245</span>
												<span class="pbmit-fid"><span>k</span></span>
											</h4>
										</div>
										<div class="pbmit-fid-icon-title">
											<span class="pbmit-fid-title">Successful Project Completion for all  <br>transport authorize</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-12 col-xl-4 mt-xl-0 mt-5">
								<div class="pbminfotech-ele-fid-style-2">
									<div class="pbmit-fld-contents">
										<div class="pbmit-fld-wrap">
											<div class="pbmit-sbox-icon-wrapper pbmit-icon-type-icon">
												<i class="pbmit-shipex-icon pbmit-shipex-icon-arrow"></i>
											</div>
											<h4 class="pbmit-fid-inner">
												<span class="pbmit-fid-before"></span>
												<span class="pbmit-number-rotate numinate" data-appear-animation="animateDigits" data-from="0" data-to="30" data-interval="25" data-before="" data-before-style="" data-after="" data-after-style="">30</span>
												<span class="pbmit-fid"><span>k</span></span>
											</h4>
										</div>
										<div class="pbmit-fid-icon-title">
											<span class="pbmit-fid-title">proactive communication are key to successful <br>transport project completion</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-12 col-xl-4 mt-xl-0 mt-5">
								<div class="pbminfotech-ele-fid-style-2">
									<div class="pbmit-fld-contents">
										<div class="pbmit-fld-wrap">
											<div class="pbmit-sbox-icon-wrapper pbmit-icon-type-icon">
												<i class="pbmit-shipex-icon pbmit-shipex-icon-arrow"></i>
											</div>
											<h4 class="pbmit-fid-inner">
												<span class="pbmit-fid-before"></span>
												<span class="pbmit-number-rotate numinate" data-appear-animation="animateDigits" data-from="0" data-to="89" data-interval="25" data-before="" data-before-style="" data-after="" data-after-style="">89</span>
												<span class="pbmit-fid"><span>m</span></span>
											</h4>
										</div>
										<div class="pbmit-fid-icon-title">
											<span class="pbmit-fid-title">Careful planning, resource management, and strong <br> communication throughout the process</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- Fid End -->
        </div>
        <!-- Page Content End -->
<br><br><br>
        <!-- footer -->
		<footer class="site-footer pbmit-bg-color-secondary">
			<div class="pbmit-footer-big-area-wrapper">

				<div class="pbmit-footer-widget-area">
					<div class="container">
						<div class="row">
							<div class="pbmit-footer-widget-col-1 col-md-4">
								<aside class="widget">
									<div class="pbmit-footer-logo">
										<img src="images/logo-footer.png" class="img-fluid" alt="">
									</div><br>
									<ul class="pbmit-social-links">
										<li class="pbmit-social-li pbmit-social-facebook">
											<a title="Facebook" href="#" target="_blank">
												<span><i class="pbmit-base-icon-facebook-f"></i></span>
											</a>
										</li>
										<li class="pbmit-social-li pbmit-social-twitter">
											<a title="Twitter" href="#" target="_blank">
												<span><i class="pbmit-base-icon-twitter-2"></i></span>
											</a>
										</li>
										<li class="pbmit-social-li pbmit-social-linkedin">
											<a title="LinkedIn" href="#" target="_blank">
												<span><i class="pbmit-base-icon-linkedin-in"></i></span>
											</a>
										</li>
										<li class="pbmit-social-li pbmit-social-instagram">
											<a title="Instagram" href="#" target="_blank">
												<span><i class="pbmit-base-icon-instagram"></i></span>
											</a>
										</li>
									</ul>
								</aside>
							</div>
							<div class="pbmit-footer-widget-col-2 col-md-4">
								<aside class="widget">
									<h2 class="widget-title">Contact Us</h2>
									<div class="pbmit-contact-widget-lines">
										<div class="pbmit-contact-widget-line pbmit-base-icon-email">info@titanxlogistics.us</div>
									</div>
								</aside>
							</div>
              <div class="pbmit-footer-widget-col-3 col-md-2">
								<aside class="widget">
									<h2 class="widget-title">Useful Link</h2>
									<ul class="menu">
										<li><a href="/about-us">About</a></li>
										<li><a href="/services">Our Service</a></li>
										<li><a href="/about-us">Company</a></li>
										<li><a href="/">News & Media</a></li>
									</ul>
								</aside>
							</div>
							<div class="pbmit-footer-widget-col-4 col-md-2">
								<aside class="widget widget_text">
									<h2 class="widget-title">Our Services</h2>
									<ul class="menu">
                    <li><a href="/services">Logistics</a></li>
										<li><a href="/services">Manufacturing</a></li>
										<li><a href="/services">Production</a></li>
										<li><a href="/services">Transportation</a></li>
										<li><a href="/services">Warehouse</a></li>
										<li><a href="/services">Distribution</a></li>
									</ul>
								</aside>
							</div>
						</div>
					</div>
				</div>
				<div class="pbmit-footer-text-area">
					<div class="container">
						<div class="pbmit-footer-text-inner">
							<div class="row">
								<div class="col-md-12">
									<div class="pbmit-footer-copyright-text-area">
										Copyright © 2026 <a href="#">Titan X Logistics</a>, All Rights Reserved.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
        </footer>
        <!-- footer End -->

    </div>
    <!-- page wrapper End -->

	<!-- Search Box Start Here -->
	<div class="pbmit-search-overlay">
		<div class="pbmit-icon-close">
			<svg class="qodef-svg--close qodef-m" xmlns="http://www.w3.org/2000/svg" width="28.163" height="28.163" viewBox="0 0 26.163 26.163">
				<rect width="36" height="1" transform="translate(0.707) rotate(45)"></rect>
				<rect width="36" height="1" transform="translate(0 25.456) rotate(-45)"></rect>
			</svg>
		</div>
		<div class="pbmit-search-outer">
			<form class="pbmit-site-searchform">
				<input type="search" class="form-control field searchform-s" name="s" placeholder="Search …">
				<button type="submit"></button>
			</form>
		</div>
	</div>
	<!-- Search Box End Here -->

	<!-- Scroll To Top -->
	<div class="pbmit-backtotop">
		<div class="pbmit-arrow">
			<i class="pbmit-base-icon-plane"></i>
		</div>
		<div class="pbmit-hover-arrow">
			<i class="pbmit-base-icon-plane"></i>
		</div>
	</div>
	<!-- Scroll To Top End -->

	` }} 
      />
    </>
  );
}
