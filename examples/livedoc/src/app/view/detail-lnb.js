define( [ 'backbone', 'widget-scrollview', 'template!view/detail-lnb' ], function ( Backbone, ScrollView, template ) {

	return Backbone.View.extend( {

		el: '#detail-lnb',

		initialize: function () {
			this.render();
		},

		render: function () {
			this.$el.html( template( { collection: this.collection.toJSON(), model: this.model.toJSON() } ) );

			this.scrollView = this.$el.find( '#scrollView' ).css( {
				height: window.innerHeight
			} ).featuredScrollView( { bounce: false } ).data( 'featuredScrollView' );

			this.inActiveEvent();
			this.activeEvent();

			return this;
		},

		update: function () {
			// 초기화
			this.$el.find( '.list-group-item ' ).removeClass( 'active' );

			// 현재 메뉴 액티브
			var $currentItem = this.$( '[data-id=' + this.model.id + ']' );
			$currentItem.addClass( 'active' );

			// 현재 메뉴로 스크롤 위치 변경
			if ( this.scrollView.$el.find( ' > div:last-child' ).css( 'position' ) === 'absolute' ) {
				var currentScrollY = ($currentItem.index() - 1) * -Math.abs( $currentItem.height() );

				currentScrollY = currentScrollY > this.scrollView.iscroll.maxScrollY
					? currentScrollY
					: this.scrollView.iscroll.maxScrollY;

				this.scrollView.iscroll.scrollTo( 0, currentScrollY, 350 );
			}
		},

		inActiveEvent: function () {
			var $scrollView = this.$el.find( '#scrollView' );
			$scrollView.off( 'mouseover.detail' );
			$scrollView.off( 'mouseout.detail' );
			$( window ).off( 'mousewheel.detail DOMMouseScroll.detail' );
			$( window ).off( 'scroll.detail' );
		},

		activeEvent: function () {
			var self = this;
			var $scrollView = this.$el.find( '#scrollView' );

			// 스크롤뷰와 윈도우 기본 스크롤이 독립적으로 동작하도록 수정
			$scrollView.on( 'mouseover.detail',function ( e ) {
				$( window ).on( 'mousewheel.detail DOMMouseScroll.detail', function ( e ) {
					var delta = e.wheelDelta || -e.detail;
					this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
					e.preventDefault();
				} );
			} ).on( 'mouseout.detail', function ( e ) {
					$( window ).off( 'mousewheel.detail DOMMouseScroll.detail' );
				} );

			// LNB가 따라다니도록 TOP 값을 윈도우 기본 스크롤 수 업데이트
			$( window ).on( 'scroll.detail', function ( e ) {
				self.$el.find( '#scrollView' ).css( {
					top: e.currentTarget.scrollY
				} );
			} );
		}
	} );
} );