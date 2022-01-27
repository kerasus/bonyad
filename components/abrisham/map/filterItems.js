var FilterItems = {
    reshte: [
        {
            name: 'رشته ریاضی',
            selected: false
        },
        {
            name: 'رشته تجربی',
            selected: false
        }
    ],
    path: {
        abrisham: {
            name: 'راه ابریشم',
            selected: false,
            steps: [
                {
                    name: 'پیله',
                    selected: false
                },
                {
                    name: 'فرسنگ 1',
                    selected: false
                },
                {
                    name: 'فرسنگ 2',
                    selected: false
                },
                {
                    name: 'فرسنگ 3',
                    selected: false
                },
                {
                    name: 'فرسنگ 4',
                    selected: false
                },
                {
                    name: 'فرسنگ 5',
                    selected: false
                },
                {
                    name: 'فرسنگ 6',
                    selected: false
                },
                {
                    name: 'فرسنگ 7',
                    selected: false
                },
                {
                    name: 'فرسنگ 8',
                    selected: false
                },
                {
                    name: 'فرسنگ 9',
                    selected: false
                }
            ],
            lessons: [
                {
                    name: 'ریاضی',
                    selected: false,
                    teachers: [1]
                },
                {
                    name: 'فیزیک',
                    selected: false,
                    teachers: [2, 5]
                },
                {
                    name: 'شیمی',
                    selected: false,
                    teachers: [3]
                },
                {
                    name: 'زیست',
                    selected: false,
                    teachers: [4]
                }
            ]
        },
        oghianous: {
            name: 'اقیانوس',
            selected: false,
            steps: [
                {
                    name: 'لنگرگاه 1',
                    selected: false
                },
                {
                    name: 'لنگرگاه 2',
                    selected: false
                },
                {
                    name: 'لنگرگاه 3',
                    selected: false
                },
                {
                    name: 'لنگرگاه 4',
                    selected: false
                },
                {
                    name: 'لنگرگاه 5',
                    selected: false
                },
                {
                    name: 'لنگرگاه 6',
                    selected: false
                },
                {
                    name: 'لنگرگاه 7',
                    selected: false
                },
                {
                    name: 'لنگرگاه 8',
                    selected: false
                },
                {
                    name: 'لنگرگاه 9',
                    selected: false
                },
                {
                    name: 'لنگرگاه 10',
                    selected: false
                },
                {
                    name: 'لنگرگاه 11',
                    selected: false
                },
                {
                    name: 'لنگرگاه 12',
                    selected: false
                }
            ],
            lessons: []
        }
    },
    teachers: [
        {
            id: 1,
            name: 'صادق ثابتی',
            selected: false
        },
        {
            id: 2,
            name: 'پرویز کازرانیان',
            selected: false
        },
        {
            id: 3,
            name: 'حامد پویان نظر',
            selected: false
        },
        {
            id: 4,
            name: 'جلال موقاری',
            selected: false
        },
        {
            id: 5,
            name: 'پیمان طلوعی',
            selected: false
        }
    ]
};

var initFilterItems = {
    install: function (vue, opts){
        // FilterItems.path.abrisham.selected = true;
        // FilterItems.path.oghianous.selected = false;
    }
};

export {FilterItems, initFilterItems};
