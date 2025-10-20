package com.projects.book.book;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.projects.book.common.BaseEntity;
import com.projects.book.feedback.Feedback;
import com.projects.book.history.BookTransactionHistory;
import com.projects.book.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;


@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Book extends BaseEntity {

    private String title;

    private String authorName;

    private String isbn;

    private String synopsis;

    private String bookCover;

    private boolean archived;

    private boolean shareable;

    @ManyToOne
    @JoinColumn(
            name = "owner_id"
    )
    @JsonIgnore
    private User owner;

    @OneToMany(
            mappedBy = "book"
    )
    private List<Feedback> feedbacks;

    @OneToMany(
            mappedBy = "book"
    )
    private List<BookTransactionHistory> histories;
}
