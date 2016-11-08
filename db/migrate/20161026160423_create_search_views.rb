class CreateSearchViews < ActiveRecord::Migration[5.0]
  def up
    execute <<-SQL
      CREATE VIEW searches AS
        SELECT
          cancer_types.id AS searchable_id,
          'CancerType' AS searchable_type,
          cancer_types.name AS term
        FROM cancer_types

        UNION

        SELECT
          events.id AS searchable_id,
          'Event' AS searchable_type,
          events.title AS term
        FROM events

        UNION

        SELECT
          investigators.id AS searchable_id,
          'Investigator' AS searchable_type,
          investigators.name AS term
        FROM investigators

        UNION

        SELECT
          projects.id AS searchable_id,
          'Project' AS searchable_type,
          projects.title AS term
        FROM projects WHERE projects.status::integer IN (1)

        UNION

        SELECT
          projects.id AS searchable_id,
          'Project' AS searchable_type,
          projects.summary AS term
        FROM projects WHERE projects.status::integer IN (1)

        UNION

        SELECT
          organizations.id AS searchable_id,
          'Organization' AS searchable_type,
          organizations.name AS term
        FROM organizations

        UNION

        SELECT
          organizations.id AS searchable_id,
          'Organization' AS searchable_type,
          organizations.acronym AS term
        FROM organizations;

      CREATE INDEX index_projects_on_title        ON projects USING gin(to_tsvector('english', title));
      CREATE INDEX index_projects_on_summary      ON projects USING gin(to_tsvector('english', summary));
      CREATE INDEX index_investigators_on_name    ON investigators USING gin(to_tsvector('english', name));
      CREATE INDEX index_events_on_title          ON events USING gin(to_tsvector('english', title));
      CREATE INDEX index_events_on_description    ON events USING gin(to_tsvector('english', description));
      CREATE INDEX index_cancer_types_on_name     ON cancer_types USING gin(to_tsvector('english', name));
      CREATE INDEX index_organizations_on_name    ON organizations USING gin(to_tsvector('english', name));
      CREATE INDEX index_organizations_on_acronym ON organizations USING gin(to_tsvector('english', acronym));
    SQL
  end

  def down
    execute <<-SQL
      DROP VIEW searches;
      DROP INDEX index_projects_on_title;
      DROP INDEX index_projects_on_summary;
      DROP INDEX index_investigators_on_name;
      DROP INDEX index_events_on_title;
      DROP INDEX index_events_on_description;
      DROP INDEX index_cancer_types_on_name;
      DROP INDEX index_organizations_on_name;
      DROP INDEX index_organizations_on_acronym;
    SQL
  end
end
