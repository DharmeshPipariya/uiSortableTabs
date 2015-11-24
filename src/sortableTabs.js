var app = angular.module('sortableTabs', []);

app.directive('sortableTab', function () {
    return {
        link: function (scope, element, attrs, controller) {
            var index = 0, tabs, dragging, offset = { x: 0, y: 0 }, placeholder = { element: null, index: 0 };

            var match = attrs.ngRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            scope.$watch(match[2], function (newTabs) { tabs = newTabs; });

            element.on("mousedown touchstart MSPointerDown pointerdown", function (e) {
                angular.element(document).on("mousemove touchmove MSPointerMove pointermove", dragMove);
                angular.element(document).on("mouseup touchend MSPointerUp pointerup", dragEnd);
            });

            var dragMove = function (e) {
                var orig = e.originalEvent, touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig];
                var touch = e.touches ? e.touches[0] : e;
                if (dragging) {
                    placeholder.element.css({ 'left': touchPoints[0].pageX - offset.x, 'top': touchPoints[0].pageY - offset.y });
                    var target = _closest(document.elementFromPoint(touchPoints[0].pageX, touchPoints[0].pageY), 'li');
                    if (target && angular.element(target).parent().is(element.parent())) {
                        angular.element(target).not('.disabled').addClass('hover').siblings().removeClass('hover');
                        placeholder.index = angular.element(target).index();
                    }
                }
                else {
                    index = placeholder.index = (dragging = element).index();
                    offset.x = touchPoints[0].pageX - dragging.offset().left;
                    offset.y = touchPoints[0].pageY - dragging.offset().top;
                    element.parent().addClass('dragging');
                    placeholder.element = dragging.clone();
                    placeholder.element.addClass('placeholder-tab');
                    placeholder.element.css({ 'position': 'fixed', 'pointer-events': 'none', 'z-index': 1000, 'left': touchPoints[0].pageX - offset.x, 'top': touchPoints[0].pageY - offset.y });
                    dragging.parent().append(placeholder.element);
                }
                e.preventDefault();
                e.stopPropagation();
            };
            var dragEnd = function (e) {
                angular.element(document).off("mousemove touchmove MSPointerMove pointermove", dragMove);
                angular.element(document).off("mouseup touchend MSPointerUp pointerup", dragEnd);
                if (dragging) {
                    placeholder.element.css({ 'position': '', 'z-index': '', 'left': '', 'top': '' });
                    element.parent().removeClass('dragging');
                    if (index !== placeholder.index && placeholder.index < element.siblings().length - 2) {
                        tabs.splice(placeholder.index, 0, tabs.splice(index, 1)[0]);
                        scope.$apply();
                    }
                    dragging.parent().children('.placeholder-tab').remove();
                    index = placeholder.index = offset.x = offset.y = 0;
                    dragging = placeholder.element = null;
                }
                e.preventDefault();
                e.stopPropagation();
            };
            var _closest = function (el, tag) {
                tag = tag.toUpperCase();
                do {
                    if (el.nodeName === tag) {
                        return el;
                    }
                } while (el = el.parentNode);
                return null;
            };
        }
    }
});